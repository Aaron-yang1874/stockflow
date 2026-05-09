import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Supplier, SupplierStatus } from './entities/supplier.entity';
import { CreateSupplierDto, UpdateSupplierDto, QuerySupplierDto } from './dto/supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepo: Repository<Supplier>,
  ) {}

  async create(dto: CreateSupplierDto): Promise<Supplier> {
    const existing = await this.supplierRepo.findOne({ where: { code: dto.code } });
    if (existing) {
      throw new NotFoundException(`供应商编码 ${dto.code} 已存在`);
    }
    const supplier = this.supplierRepo.create(dto);
    return this.supplierRepo.save(supplier);
  }

  async findAll(query: QuerySupplierDto) {
    const { page = 1, pageSize = 10, keyword, status } = query;
    const where: any = {};
    if (status) where.status = status;
    if (keyword) {
      where.name = Like(`%${keyword}%`);
    }

    const [list, total] = await this.supplierRepo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return { list, total, page, pageSize };
  }

  async findOne(id: string): Promise<Supplier> {
    const supplier = await this.supplierRepo.findOne({ where: { id } });
    if (!supplier) {
      throw new NotFoundException(`供应商 ${id} 不存在`);
    }
    return supplier;
  }

  async update(id: string, dto: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.findOne(id);
    Object.assign(supplier, dto);
    return this.supplierRepo.save(supplier);
  }

  async remove(id: string): Promise<void> {
    const supplier = await this.findOne(id);
    await this.supplierRepo.remove(supplier);
  }
}
