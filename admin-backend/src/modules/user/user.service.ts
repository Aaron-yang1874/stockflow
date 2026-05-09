import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findAll(): Promise<User[]> {
    return await this.userRepo.find({ relations: ['roles', 'dept'] });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['roles', 'dept'],
    });
    if (!user) throw new NotFoundException('用户不存在');
    return user;
  }

  async create(data: Partial<User>): Promise<User> {
    if (data.password) {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);
    }
    const user = this.userRepo.create(data);
    return await this.userRepo.save(user);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    if (data.password) {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);
    }
    Object.assign(user, data);
    return await this.userRepo.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.userRepo.softDelete(id);
  }
}
