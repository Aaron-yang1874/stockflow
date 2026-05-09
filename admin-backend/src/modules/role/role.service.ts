import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Role) private roleRepo: Repository<Role>) {}

  async findAll(): Promise<Role[]> {
    return await this.roleRepo.find({ relations: ['permissions'] });
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) throw new NotFoundException('角色不存在');
    return role;
  }

  async create(data: Partial<Role>): Promise<Role> {
    const role = this.roleRepo.create(data);
    return await this.roleRepo.save(role);
  }

  async update(id: string, data: Partial<Role>): Promise<Role> {
    const role = await this.findOne(id);
    Object.assign(role, data);
    return await this.roleRepo.save(role);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.roleRepo.softDelete(id);
  }
}
