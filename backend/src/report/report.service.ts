import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Inventory } from '../inventory/entities/inventory.entity';
import { Product } from '../product/entities/product.entity';
import { Warehouse } from '../warehouse/entities/warehouse.entity';
import { StockIn } from '../stock-in/entities/stock-in.entity';
import { StockOut } from '../stock-out/entities/stock-out.entity';
import { StockInItem } from '../stock-in/entities/stock-in-item.entity';
import { StockOutItem } from '../stock-out/entities/stock-out-item.entity';
import { PurchaseOrder } from '../purchase-order/entities/purchase-order.entity';
import { SalesOrder } from '../sales-order/entities/sales-order.entity';
import { DateRangeDto } from './dto/date-range.dto';

export interface DashboardOverview {
  totalProducts: number;
  totalWarehouses: number;
  totalStockValue: number;
  todayInboundCount: number;
  todayInboundAmount: number;
  todayOutboundCount: number;
  todayOutboundAmount: number;
  pendingPurchaseOrders: number;
  pendingSalesOrders: number;
  lowStockProducts: Array<{
    productId: string;
    productName: string;
    productSku: string;
    currentQuantity: number;
    minStockLevel: number;
  }>;
}

export interface StockSummaryItem {
  warehouseId: string;
  warehouseName: string;
  totalQuantity: number;
  totalValue: number;
}

export interface InboundDailyRecord {
  date: string;
  quantity: number;
  amount: number;
}

export interface InboundTypeSummary {
  type: string;
  quantity: number;
  amount: number;
}

export interface OutboundDailyRecord {
  date: string;
  quantity: number;
  amount: number;
}

export interface OutboundTypeSummary {
  type: string;
  quantity: number;
  amount: number;
}

export interface ProductTurnoverItem {
  productId: string;
  productName: string;
  productSku: string;
  inboundTotal: number;
  outboundTotal: number;
  currentStock: number;
  turnoverRate: number;
}

export interface SupplierAnalysisItem {
  supplierId: string;
  supplierName: string;
  purchaseCount: number;
  totalAmount: number;
  lastPurchaseDate: Date | null;
}

export interface CustomerAnalysisItem {
  customerId: string;
  customerName: string;
  salesCount: number;
  totalAmount: number;
  lastSaleDate: Date | null;
}

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>,
    @InjectRepository(StockIn)
    private readonly stockInRepo: Repository<StockIn>,
    @InjectRepository(StockOut)
    private readonly stockOutRepo: Repository<StockOut>,
    @InjectRepository(StockInItem)
    private readonly stockInItemRepo: Repository<StockInItem>,
    @InjectRepository(StockOutItem)
    private readonly stockOutItemRepo: Repository<StockOutItem>,
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepo: Repository<PurchaseOrder>,
    @InjectRepository(SalesOrder)
    private readonly salesOrderRepo: Repository<SalesOrder>,
  ) {}

  async getDashboardOverview(): Promise<DashboardOverview> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalProducts,
      totalWarehouses,
      inventories,
      todayInbounds,
      todayOutbounds,
      pendingPurchaseOrders,
      pendingSalesOrders,
      lowStockProducts,
    ] = await Promise.all([
      this.productRepo.count(),
      this.warehouseRepo.count(),
      this.inventoryRepo.find({ relations: ['product'] }),
      this.stockInRepo.find({
        where: { createdAt: Between(today, tomorrow) },
        relations: ['items'],
      }),
      this.stockOutRepo.find({
        where: { createdAt: Between(today, tomorrow) },
        relations: ['items'],
      }),
      this.purchaseOrderRepo.count({ where: { status: 'draft' as any } }),
      this.salesOrderRepo.count({ where: { status: 'draft' as any } }),
      this.inventoryRepo
        .createQueryBuilder('inv')
        .leftJoinAndSelect('inv.product', 'product')
        .where('inv.quantity <= product.minStock')
        .andWhere('inv.quantity > 0')
        .orderBy('inv.quantity', 'ASC')
        .limit(10)
        .getMany(),
    ]);

    const totalStockValue = inventories.reduce((sum, inv) => {
      const price = inv.product?.costPrice ?? 0;
      return sum + (inv.quantity || 0) * price;
    }, 0);

    const todayInboundCount = todayInbounds.reduce(
      (s, r) => s + (r.items?.reduce((a, i) => a + (i.quantity || 0), 0) ?? 0),
      0,
    );
    const todayInboundAmount = todayInbounds.reduce(
      (s, r) => s + (r.totalAmount || 0),
      0,
    );
    const todayOutboundCount = todayOutbounds.reduce(
      (s, r) => s + (r.items?.reduce((a, i) => a + (i.quantity || 0), 0) ?? 0),
      0,
    );
    const todayOutboundAmount = todayOutbounds.reduce(
      (s, r) => s + (r.totalAmount || 0),
      0,
    );

    return {
      totalProducts,
      totalWarehouses,
      totalStockValue,
      todayInboundCount,
      todayInboundAmount,
      todayOutboundCount,
      todayOutboundAmount,
      pendingPurchaseOrders,
      pendingSalesOrders,
      lowStockProducts: lowStockProducts.map((inv) => ({
        productId: inv.productId,
        productName: inv.product?.name ?? '',
        productSku: inv.product?.sku ?? '',
        currentQuantity: inv.quantity,
        minStockLevel: inv.product?.minStock ?? 0,
      })),
    };
  }

  async getStockSummary(query: DateRangeDto): Promise<StockSummaryItem[]> {
    let queryBuilder = this.inventoryRepo
      .createQueryBuilder('inv')
      .leftJoin('inv.warehouse', 'warehouse')
      .leftJoin('inv.product', 'product')
      .select([
        'warehouse.id AS "warehouseId"',
        'warehouse.name AS "warehouseName"',
        'COALESCE(SUM(inv.quantity), 0) AS "totalQuantity"',
        'COALESCE(SUM(inv.quantity * product.costPrice), 0) AS "totalValue"',
      ])
      .groupBy('warehouse.id')
      .addGroupBy('warehouse.name');

    if (query.warehouseId) {
      queryBuilder = queryBuilder.andWhere('warehouse.id = :warehouseId', {
        warehouseId: query.warehouseId,
      });
    }

    const rawResults = await queryBuilder.getRawMany();

    return rawResults.map((row) => ({
      warehouseId: row.warehouseId,
      warehouseName: row.warehouseName,
      totalQuantity: Number(row.totalQuantity) || 0,
      totalValue: Number(row.totalValue) || 0,
    }));
  }

  async getInboundReport(query: DateRangeDto): Promise<{
    dailyRecords: InboundDailyRecord[];
    typeSummaries: InboundTypeSummary[];
  }> {
    const startDate = query.startDate ? new Date(query.startDate) : new Date(0);
    const endDate = query.endDate ? new Date(query.endDate) : new Date();
    endDate.setHours(23, 59, 59, 999);

    const records = await this.stockInRepo.find({
      where: { createdAt: Between(startDate, endDate) },
      relations: ['items'],
    });

    const dailyMap = new Map<string, { quantity: number; amount: number }>();
    const typeMap = new Map<string, { quantity: number; amount: number }>();

    for (const record of records) {
      const dateKey = new Date(record.createdAt).toISOString().split('T')[0];
      const qty = record.items?.reduce((s, i) => s + (i.quantity || 0), 0) ?? 0;
      const amt = record.totalAmount || 0;
      const type = record.type || 'unknown';

      const daily = dailyMap.get(dateKey) || { quantity: 0, amount: 0 };
      daily.quantity += qty;
      daily.amount += amt;
      dailyMap.set(dateKey, daily);

      const typed = typeMap.get(type) || { quantity: 0, amount: 0 };
      typed.quantity += qty;
      typed.amount += amt;
      typeMap.set(type, typed);
    }

    const dailyRecords: InboundDailyRecord[] = Array.from(dailyMap.entries())
      .map(([date, val]) => ({ date, ...val }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const typeSummaries: InboundTypeSummary[] = Array.from(typeMap.entries()).map(
      ([type, val]) => ({ type, ...val }),
    );

    return { dailyRecords, typeSummaries };
  }

  async getOutboundReport(query: DateRangeDto): Promise<{
    dailyRecords: OutboundDailyRecord[];
    typeSummaries: OutboundTypeSummary[];
  }> {
    const startDate = query.startDate ? new Date(query.startDate) : new Date(0);
    const endDate = query.endDate ? new Date(query.endDate) : new Date();
    endDate.setHours(23, 59, 59, 999);

    const records = await this.stockOutRepo.find({
      where: { createdAt: Between(startDate, endDate) },
      relations: ['items'],
    });

    const dailyMap = new Map<string, { quantity: number; amount: number }>();
    const typeMap = new Map<string, { quantity: number; amount: number }>();

    for (const record of records) {
      const dateKey = new Date(record.createdAt).toISOString().split('T')[0];
      const qty = record.items?.reduce((s, i) => s + (i.quantity || 0), 0) ?? 0;
      const amt = record.totalAmount || 0;
      const type = record.type || 'unknown';

      const daily = dailyMap.get(dateKey) || { quantity: 0, amount: 0 };
      daily.quantity += qty;
      daily.amount += amt;
      dailyMap.set(dateKey, daily);

      const typed = typeMap.get(type) || { quantity: 0, amount: 0 };
      typed.quantity += qty;
      typed.amount += amt;
      typeMap.set(type, typed);
    }

    const dailyRecords: OutboundDailyRecord[] = Array.from(dailyMap.entries())
      .map(([date, val]) => ({ date, ...val }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const typeSummaries: OutboundTypeSummary[] = Array.from(typeMap.entries()).map(
      ([type, val]) => ({ type, ...val }),
    );

    return { dailyRecords, typeSummaries };
  }

  async getProductTurnover(query: DateRangeDto): Promise<ProductTurnoverItem[]> {
    const startDate = query.startDate ? new Date(query.startDate) : new Date(0);
    const endDate = query.endDate ? new Date(query.endDate) : new Date();
    endDate.setHours(23, 59, 59, 999);

    const inItems = await this.stockInItemRepo
      .createQueryBuilder('item')
      .leftJoin('item.stockIn', 'stockIn')
      .where('stockIn.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getMany();

    const outItems = await this.stockOutItemRepo
      .createQueryBuilder('item')
      .leftJoin('item.stockOut', 'stockOut')
      .where('stockOut.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getMany();

    const inventories = await this.inventoryRepo.find({ relations: ['product'] });

    const productMap = new Map<
      string,
      {
        productName: string;
        productSku: string;
        inboundTotal: number;
        outboundTotal: number;
        currentStock: number;
      }
    >();

    for (const inv of inventories) {
      productMap.set(inv.productId, {
        productName: inv.product?.name ?? '',
        productSku: inv.product?.sku ?? '',
        inboundTotal: 0,
        outboundTotal: 0,
        currentStock: inv.quantity || 0,
      });
    }

    for (const item of inItems) {
      const entry = productMap.get(item.productId);
      if (entry) entry.inboundTotal += item.quantity || 0;
    }

    for (const item of outItems) {
      const entry = productMap.get(item.productId);
      if (entry) entry.outboundTotal += item.quantity || 0;
    }

    const results: ProductTurnoverItem[] = Array.from(productMap.entries())
      .map(([productId, data]) => {
        const avgStock =
          data.inboundTotal > 0
            ? (data.currentStock + data.inboundTotal) / 2
            : data.currentStock || 1;
        const turnoverRate = avgStock > 0 ? data.outboundTotal / avgStock : 0;

        return {
          productId,
          ...data,
          turnoverRate: Math.round(turnoverRate * 100) / 100,
        };
      })
      .sort((a, b) => b.turnoverRate - a.turnoverRate);

    return results;
  }

  async getSupplierAnalysis(query: DateRangeDto): Promise<SupplierAnalysisItem[]> {
    const startDate = query.startDate ? new Date(query.startDate) : new Date(0);
    const endDate = query.endDate ? new Date(query.endDate) : new Date();
    endDate.setHours(23, 59, 59, 999);

    const orders = await this.purchaseOrderRepo.find({
      where: { createdAt: Between(startDate, endDate) },
      order: { createdAt: 'DESC' },
    });

    const supplierMap = new Map<
      string,
      {
        supplierName: string;
        purchaseCount: number;
        totalAmount: number;
        lastPurchaseDate: Date | null;
      }
    >();

    for (const order of orders) {
      const sid = order.supplierId;
      const existing = supplierMap.get(sid);

      if (existing) {
        existing.purchaseCount += 1;
        existing.totalAmount += order.totalAmount || 0;
        if (!existing.lastPurchaseDate || (order.createdAt && order.createdAt > existing.lastPurchaseDate)) {
          existing.lastPurchaseDate = order.createdAt;
        }
      } else {
        supplierMap.set(sid, {
          supplierName: '',
          purchaseCount: 1,
          totalAmount: order.totalAmount || 0,
          lastPurchaseDate: order.createdAt,
        });
      }
    }

    return Array.from(supplierMap.entries())
      .map(([supplierId, data]) => ({ supplierId, ...data }))
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }

  async getCustomerAnalysis(query: DateRangeDto): Promise<CustomerAnalysisItem[]> {
    const startDate = query.startDate ? new Date(query.startDate) : new Date(0);
    const endDate = query.endDate ? new Date(query.endDate) : new Date();
    endDate.setHours(23, 59, 59, 999);

    const orders = await this.salesOrderRepo.find({
      where: { createdAt: Between(startDate, endDate) },
      order: { createdAt: 'DESC' },
    });

    const customerMap = new Map<
      string,
      {
        customerName: string;
        salesCount: number;
        totalAmount: number;
        lastSaleDate: Date | null;
      }
    >();

    for (const order of orders) {
      const cid = order.customerId;
      const existing = customerMap.get(cid);

      if (existing) {
        existing.salesCount += 1;
        existing.totalAmount += order.totalAmount || 0;
        if (!existing.lastSaleDate || (order.createdAt && order.createdAt > existing.lastSaleDate)) {
          existing.lastSaleDate = order.createdAt;
        }
      } else {
        customerMap.set(cid, {
          customerName: '',
          salesCount: 1,
          totalAmount: order.totalAmount || 0,
          lastSaleDate: order.createdAt,
        });
      }
    }

    return Array.from(customerMap.entries())
      .map(([customerId, data]) => ({ customerId, ...data }))
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }
}