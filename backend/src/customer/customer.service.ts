import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto, UpdateCustomerDto, QueryCustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
  ) {}

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const existing = await this.customerRepo.findOne({ where: { code: dto.code } });
    if (existing) {
      throw new NotFoundException(`客户编码 ${dto.code} 已存在`);
    }
    const customer = this.customerRepo.create(dto);
    return this.customerRepo.save(customer);
  }

  async findAll(query: QueryCustomerDto) {
    const { page = 1, pageSize = 10, keyword, status } = query;
    const where: any = {};
    if (status) where.status = status;
    if (keyword) {
      where.name = Like(`%${keyword}%`);
    }

    const [list, total] = await this.customerRepo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return { list, total, page, pageSize };
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`客户 ${id} 不存在`);
    }
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);
    Object.assign(customer, dto);
    return this.customerRepo.save(customer);
  }

  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepo.remove(customer);
  }
}
