import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission) private permRepo: Repository<Permission>,
  ) {}

  async findAll(): Promise<Permission[]> {
    return await this.permRepo.find({ order: { orderNum: 'ASC' } });
  }

  async findOne(id: string): Promise<Permission> {
    const perm = await this.permRepo.findOne({ where: { id } });
    if (!perm) throw new NotFoundException('权限不存在');
    return perm;
  }

  async create(data: Partial<Permission>): Promise<Permission> {
    const perm = this.permRepo.create(data);
    return await this.permRepo.save(perm);
  }

  async update(id: string, data: Partial<Permission>): Promise<Permission> {
    const perm = await this.findOne(id);
    Object.assign(perm, data);
    return await this.permRepo.save(perm);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.permRepo.softDelete(id);
  }
}
