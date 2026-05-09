import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { QueryWarehouseDto } from './dto/query-warehouse.dto';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepo: Repository<Warehouse>,
  ) {}

  async create(dto: CreateWarehouseDto): Promise<Warehouse> {
    const warehouse = this.warehouseRepo.create(dto);
    return this.warehouseRepo.save(warehouse);
  }

  async findAll(query: QueryWarehouseDto) {
    const { page = 1, pageSize = 20, keyword, status } = query;
    const qb = this.warehouseRepo.createQueryBuilder('warehouse');

    if (keyword) {
      qb.andWhere(
        '(warehouse.name LIKE :keyword OR warehouse.code LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }
    if (status) {
      qb.andWhere('warehouse.status = :status', { status });
    }

    const [list, total] = await qb
      .orderBy('warehouse.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { list, total, page, pageSize };
  }

  async findOne(id: string): Promise<Warehouse> {
    const warehouse = await this.warehouseRepo.findOneBy({ id });
    if (!warehouse) {
      throw new NotFoundException(`仓库 ${id} 不存在`);
    }
    return warehouse;
  }

  async update(id: string, dto: UpdateWarehouseDto): Promise<Warehouse> {
    const warehouse = await this.findOne(id);
    Object.assign(warehouse, dto);
    return this.warehouseRepo.save(warehouse);
  }

  async remove(id: string): Promise<void> {
    const warehouse = await this.findOne(id);
    await this.warehouseRepo.remove(warehouse);
  }
}
