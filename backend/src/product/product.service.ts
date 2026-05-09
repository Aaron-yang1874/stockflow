import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepo.create(dto);
    return this.productRepo.save(product);
  }

  async findAll(query: QueryProductDto) {
    const { page = 1, pageSize = 20, keyword, category, status } = query;
    const qb = this.productRepo.createQueryBuilder('product');

    if (keyword) {
      qb.andWhere(
        '(product.name LIKE :keyword OR product.sku LIKE :keyword OR product.description LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }
    if (category) {
      qb.andWhere('product.category = :category', { category });
    }
    if (status) {
      qb.andWhere('product.status = :status', { status });
    }

    const [list, total] = await qb
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { list, total, page, pageSize };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`产品 ${id} 不存在`);
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
  }
}
