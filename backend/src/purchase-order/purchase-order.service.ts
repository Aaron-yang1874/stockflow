import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DataSource } from 'typeorm';
import { PurchaseOrder, PurchaseOrderStatus, PaymentStatus } from './entities/purchase-order.entity';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';
import { CreatePurchaseOrderDto, UpdatePurchaseOrderDto, QueryPurchaseOrderDto } from './dto/purchase-order.dto';

const STATUS_FLOW: Record<PurchaseOrderStatus, PurchaseOrderStatus[]> = {
  [PurchaseOrderStatus.DRAFT]: [PurchaseOrderStatus.SENT, PurchaseOrderStatus.CANCELLED],
  [PurchaseOrderStatus.SENT]: [PurchaseOrderStatus.PARTIAL, PurchaseOrderStatus.RECEIVED, PurchaseOrderStatus.CANCELLED],
  [PurchaseOrderStatus.PARTIAL]: [PurchaseOrderStatus.RECEIVED],
  [PurchaseOrderStatus.RECEIVED]: [],
  [PurchaseOrderStatus.CANCELLED]: [],
};

@Injectable()
export class PurchaseOrderService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private orderRepo: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderItem)
    private itemRepo: Repository<PurchaseOrderItem>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    return this.dataSource.transaction(async (manager) => {
      const orderNo = `PO${Date.now()}`;
      const order = new PurchaseOrder();
      order.orderNo = orderNo;
      order.supplierId = dto.supplierId;
      order.status = PurchaseOrderStatus.DRAFT;
      order.paymentStatus = PaymentStatus.UNPAID;
      order.expectedDate = dto.expectedDate ? new Date(dto.expectedDate) : null as any;
      order.remark = dto.remark || '';
      order.operatedBy = 'system';
      order.totalAmount = 0;
      order.taxAmount = 0;
      order.discountAmount = 0;
      order.finalAmount = 0;

      const savedOrder = await manager.save(order);

      let totalAmount = 0;
      let taxAmount = 0;

      const items = dto.items.map((itemDto) => {
        const amount = Number(itemDto.quantity) * Number(itemDto.unitPrice);
        const tax = amount * (Number(itemDto.taxRate || 0) / 100);
        totalAmount += amount;
        taxAmount += tax;

        const itemEntity = new PurchaseOrderItem();
        itemEntity.orderId = savedOrder.id;
        itemEntity.productId = itemDto.productId;
        itemEntity.quantity = itemDto.quantity;
        itemEntity.receivedQty = 0;
        itemEntity.unitPrice = itemDto.unitPrice;
        itemEntity.taxRate = itemDto.taxRate || 0;
        itemEntity.amount = amount + tax;
        return itemEntity;
      });

      await manager.save(items);

      savedOrder.totalAmount = Number(totalAmount.toFixed(2));
      savedOrder.taxAmount = Number(taxAmount.toFixed(2));
      savedOrder.finalAmount = Number((totalAmount + taxAmount).toFixed(2));

      return manager.save(savedOrder);
    });
  }

  async findAll(query: QueryPurchaseOrderDto) {
    const { page = 1, pageSize = 10, keyword, status, paymentStatus } = query;
    const where: any = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (keyword) where.orderNo = Like(`%${keyword}%`);

    const [list, total] = await this.orderRepo.findAndCount({
      where,
      relations: ['supplier', 'items'],
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return { list, total, page, pageSize };
  }

  async findOne(id: string): Promise<PurchaseOrder> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['supplier', 'items'],
    });
    if (!order) {
      throw new NotFoundException(`采购订单 ${id} 不存在`);
    }
    return order;
  }

  async update(id: string, dto: UpdatePurchaseOrderDto): Promise<PurchaseOrder> {
    const order = await this.findOne(id);

    if (dto.status && dto.status !== order.status) {
      const allowedTransitions = STATUS_FLOW[order.status];
      if (!allowedTransitions.includes(dto.status)) {
        throw new BadRequestException(
          `不允许从 ${order.status} 状态流转到 ${dto.status}`,
        );
      }
      order.status = dto.status;
    }

    if (dto.paymentStatus) {
      order.paymentStatus = dto.paymentStatus;
    }
    if (dto.remark !== undefined) {
      order.remark = dto.remark;
    }

    return this.orderRepo.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    if (order.status === PurchaseOrderStatus.SENT || order.status === PurchaseOrderStatus.PARTIAL) {
      throw new BadRequestException('已发送或部分收货的订单不能删除');
    }
    await this.itemRepo.delete({ orderId: id });
    await this.orderRepo.remove(order);
  }
}
