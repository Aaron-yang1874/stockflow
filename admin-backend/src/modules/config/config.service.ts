import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Config } from './entities/config.entity';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(Config) private configRepo: Repository<Config>,
  ) {}

  async findAll(): Promise<Config[]> {
    return await this.configRepo.find();
  }

  async findOne(id: string): Promise<Config> {
    const config = await this.configRepo.findOne({ where: { id } });
    if (!config) throw new NotFoundException('配置不存在');
    return config;
  }

  async create(data: Partial<Config>): Promise<Config> {
    const config = this.configRepo.create(data);
    return await this.configRepo.save(config);
  }

  async update(id: string, data: Partial<Config>): Promise<Config> {
    const config = await this.findOne(id);
    Object.assign(config, data);
    return await this.configRepo.save(config);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.configRepo.softDelete(id);
  }

  async findByKey(key: string): Promise<string | null> {
    const config = await this.configRepo.findOne({
      where: { configKey: key },
    });
    return config ? config.configValue : null;
  }
}
