import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { StockOut } from './entities/stock-out.entity';
import { StockOutItem } from './entities/stock-out-item.entity';
import { CreateStockOutDto } from './dto/create-stock-out.dto';
import { UpdateStockOutDto } from './dto/update-stock-out.dto';
import { QueryStockOutDto } from './dto/query-stock-out.dto';
import { Inventory } from '../inventory/entities/inventory.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StockOutService {
  constructor(
    @InjectRepository(StockOut)
    private stockOutRepo: Repository<StockOut>,
    @InjectRepository(StockOutItem)
    private stockOutItemRepo: Repository<StockOutItem>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateStockOutDto, operatedBy: string): Promise<StockOut> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const item of dto.items) {
        const inventory = await queryRunner.manager.findOne(Inventory, {
          where: { productId: item.productId, warehouseId: dto.warehouseId },
        });

        if (!inventory || Number(inventory.quantity) < item.quantity) {
          throw new BadRequestException(
            `产品 ${item.productId} 在仓库 ${dto.warehouseId} 库存不足，当前库存: ${inventory?.quantity ?? 0}`,
          );
        }
      }

      const totalAmount = dto.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      );

      const stockOut = new StockOut();
      stockOut.id = uuidv4();
      stockOut.orderNo = this.generateOrderNo(dto.type);
      stockOut.type = dto.type;
      stockOut.customerId = dto.customerId || null;
      stockOut.warehouseId = dto.warehouseId;
      stockOut.totalAmount = totalAmount;
      stockOut.status = 'pending';
      stockOut.remark = dto.remark || null;
      stockOut.operatedBy = operatedBy;

      const savedStockOut = await queryRunner.manager.save(stockOut);

      const items = dto.items.map((item) => {
        const soi = new StockOutItem();
        soi.id = uuidv4();
        soi.stockOutId = savedStockOut.id;
        soi.productId = item.productId;
        soi.quantity = item.quantity;
        soi.unitPrice = item.unitPrice;
        soi.amount = item.quantity * item.unitPrice;
        return soi;
      });
      await queryRunner.manager.save(items);

      for (const item of dto.items) {
        await queryRunner.manager.update(
          Inventory,
          { productId: item.productId, warehouseId: dto.warehouseId },
          { quantity: () => `quantity - ${item.quantity}` },
        );
      }

      savedStockOut.status = 'completed';
      await queryRunner.manager.save(savedStockOut);

      await queryRunner.commitTransaction();
      return this.findOne(savedStockOut.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(query: QueryStockOutDto): Promise<{ list: StockOut[]; total: number }> {
    const { page = 1, pageSize = 10, type, status, startDate, endDate } = query;
    const qb = this.stockOutRepo.createQueryBuilder('stockOut');

    if (type) {
      qb.andWhere('stockOut.type = :type', { type });
    }
    if (status) {
      qb.andWhere('stockOut.status = :status', { status });
    }
    if (startDate) {
      qb.andWhere('stockOut.createdAt >= :startDate', { startDate: new Date(startDate) });
    }
    if (endDate) {
      qb.andWhere('stockOut.createdAt <= :endDate', { endDate: new Date(endDate + 'T23:59:59') });
    }

    qb.leftJoinAndSelect('stockOut.items', 'items');
    qb.orderBy('stockOut.createdAt', 'DESC');

    const [list, total] = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { list, total };
  }

  async findOne(id: string): Promise<StockOut> {
    const stockOut = await this.stockOutRepo.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!stockOut) {
      throw new NotFoundException(`出库单 ${id} 不存在`);
    }
    return stockOut;
  }

  async update(id: string, dto: UpdateStockOutDto): Promise<StockOut> {
    const stockOut = await this.findOne(id);
    Object.assign(stockOut, dto);
    return this.stockOutRepo.save(stockOut);
  }

  async remove(id: string): Promise<void> {
    const stockOut = await this.findOne(id);
    if (stockOut.status === 'completed') {
      throw new BadRequestException('已完成的出库单不能删除');
    }
    await this.stockOutRepo.remove(stockOut);
  }

  private generateOrderNo(type: string): string {
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const prefixMap: Record<string, string> = {
      sale: 'CKXS',
      material: 'CKCL',
      scrap: 'CKBF',
      adjustment: 'CKTZ',
    };
    return `${prefixMap[type] || 'CK'}${dateStr}${random}`;
  }
}
