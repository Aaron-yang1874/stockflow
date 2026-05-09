import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { StockIn } from './entities/stock-in.entity';
import { StockInItem } from './entities/stock-in-item.entity';
import { CreateStockInDto } from './dto/create-stock-in.dto';
import { UpdateStockInDto } from './dto/update-stock-in.dto';
import { QueryStockInDto } from './dto/query-stock-in.dto';
import { Inventory } from '../inventory/entities/inventory.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StockInService {
  constructor(
    @InjectRepository(StockIn)
    private stockInRepo: Repository<StockIn>,
    @InjectRepository(StockInItem)
    private stockInItemRepo: Repository<StockInItem>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateStockInDto, operatedBy: string): Promise<StockIn> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const totalAmount = dto.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      );

      const stockIn = new StockIn();
      stockIn.id = uuidv4();
      stockIn.orderNo = this.generateOrderNo(dto.type);
      stockIn.type = dto.type;
      stockIn.supplierId = dto.supplierId || null;
      stockIn.warehouseId = dto.warehouseId;
      stockIn.totalAmount = totalAmount;
      stockIn.status = 'pending';
      stockIn.remark = dto.remark || null;
      stockIn.operatedBy = operatedBy;

      const savedStockIn = await queryRunner.manager.save(stockIn);

      const items = dto.items.map((item) => {
        const si = new StockInItem();
        si.id = uuidv4();
        si.stockInId = savedStockIn.id;
        si.productId = item.productId;
        si.quantity = item.quantity;
        si.unitPrice = item.unitPrice;
        si.amount = item.quantity * item.unitPrice;
        return si;
      });
      await queryRunner.manager.save(items);

      for (const item of dto.items) {
        const inventory = await queryRunner.manager.findOne(Inventory, {
          where: { productId: item.productId, warehouseId: dto.warehouseId },
        });

        if (inventory) {
          await queryRunner.manager.update(
            Inventory,
            { productId: item.productId, warehouseId: dto.warehouseId },
            { quantity: () => `quantity + ${item.quantity}` },
          );
        } else {
          await queryRunner.manager.insert(Inventory, {
            id: uuidv4(),
            productId: item.productId,
            warehouseId: dto.warehouseId,
            quantity: item.quantity,
          });
        }
      }

      savedStockIn.status = 'completed';
      await queryRunner.manager.save(savedStockIn);

      await queryRunner.commitTransaction();
      return this.findOne(savedStockIn.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(query: QueryStockInDto): Promise<{ list: StockIn[]; total: number }> {
    const { page = 1, pageSize = 10, type, status, startDate, endDate } = query;
    const qb = this.stockInRepo.createQueryBuilder('stockIn');

    if (type) {
      qb.andWhere('stockIn.type = :type', { type });
    }
    if (status) {
      qb.andWhere('stockIn.status = :status', { status });
    }
    if (startDate) {
      qb.andWhere('stockIn.createdAt >= :startDate', { startDate: new Date(startDate) });
    }
    if (endDate) {
      qb.andWhere('stockIn.createdAt <= :endDate', { endDate: new Date(endDate + 'T23:59:59') });
    }

    qb.leftJoinAndSelect('stockIn.items', 'items');
    qb.orderBy('stockIn.createdAt', 'DESC');

    const [list, total] = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { list, total };
  }

  async findOne(id: string): Promise<StockIn> {
    const stockIn = await this.stockInRepo.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!stockIn) {
      throw new NotFoundException(`入库单 ${id} 不存在`);
    }
    return stockIn;
  }

  async update(id: string, dto: UpdateStockInDto): Promise<StockIn> {
    const stockIn = await this.findOne(id);
    Object.assign(stockIn, dto);
    return this.stockInRepo.save(stockIn);
  }

  async remove(id: string): Promise<void> {
    const stockIn = await this.findOne(id);
    if (stockIn.status === 'completed') {
      throw new BadRequestException('已完成的入库单不能删除');
    }
    await this.stockInRepo.remove(stockIn);
  }

  private generateOrderNo(type: string): string {
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const prefixMap: Record<string, string> = {
      purchase: 'RKCG',
      return: 'RKTH',
      production: 'RKSC',
      adjustment: 'RKTZ',
    };
    return `${prefixMap[type] || 'RK'}${dateStr}${random}`;
  }
}
