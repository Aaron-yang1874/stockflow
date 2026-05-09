import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dept } from './entities/dept.entity';

@Injectable()
export class DeptService {
  constructor(@InjectRepository(Dept) private deptRepo: Repository<Dept>) {}

  async findAll(): Promise<Dept[]> {
    return await this.deptRepo.find({ order: { orderNum: 'ASC' } });
  }

  async findOne(id: string): Promise<Dept> {
    const dept = await this.deptRepo.findOne({ where: { id } });
    if (!dept) throw new NotFoundException('部门不存在');
    return dept;
  }

  async create(data: Partial<Dept>): Promise<Dept> {
    const dept = this.deptRepo.create(data);
    return await this.deptRepo.save(dept);
  }

  async update(id: string, data: Partial<Dept>): Promise<Dept> {
    const dept = await this.findOne(id);
    Object.assign(dept, data);
    return await this.deptRepo.save(dept);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.deptRepo.softDelete(id);
  }
}
