import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { QueryInventoryDto } from './dto/query-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepo: Repository<Inventory>,
  ) {}

  async create(data: Partial<Inventory>): Promise<Inventory> {
    const inventory = this.inventoryRepo.create(data);
    return this.inventoryRepo.save(inventory);
  }

  async findAll(query: QueryInventoryDto) {
    const {
      page = 1,
      pageSize = 20,
      warehouseId,
      productId,
      keyword,
      lowStock,
    } = query;
    const qb = this.inventoryRepo
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.warehouse', 'warehouse');

    if (warehouseId) {
      qb.andWhere('inventory.warehouseId = :warehouseId', { warehouseId });
    }
    if (productId) {
      qb.andWhere('inventory.productId = :productId', { productId });
    }
    if (keyword) {
      qb.andWhere(
        '(product.name LIKE :keyword OR product.sku LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    const [list, total] = await qb
      .orderBy('inventory.updatedAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    let result = list;

    if (lowStock) {
      result = list.filter((item) => {
        const available = Number(item.quantity) - Number(item.reservedQty);
        return (
          item.product && available < Number(item.product.minStock)
        );
      });
    }

    return { list: result, total, page, pageSize };
  }

  async findOne(id: string): Promise<Inventory> {
    const inventory = await this.inventoryRepo.findOne({
      where: { id },
      relations: ['product', 'warehouse'],
    });
    if (!inventory) {
      throw new NotFoundException(`库存记录 ${id} 不存在`);
    }
    return inventory;
  }

  async findByProductAndWarehouse(
    productId: string,
    warehouseId: string,
  ): Promise<Inventory | null> {
    return this.inventoryRepo.findOne({
      where: { productId, warehouseId },
      relations: ['product', 'warehouse'],
    });
  }

  async update(id: string, data: Partial<Inventory>): Promise<Inventory> {
    const inventory = await this.findOne(id);
    Object.assign(inventory, data);
    return this.inventoryRepo.save(inventory);
  }

  async remove(id: string): Promise<void> {
    const inventory = await this.findOne(id);
    await this.inventoryRepo.remove(inventory);
  }

  async getLowStockAlerts() {
    return this.inventoryRepo
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.warehouse', 'warehouse')
      .where('product.minStock > 0')
      .getMany()
      .then((list) =>
        list.filter((item) => {
          const available =
            Number(item.quantity) - Number(item.reservedQty);
          return available < Number(item.product.minStock);
        }),
      );
  }
}
