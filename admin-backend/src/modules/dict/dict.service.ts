import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dict } from './entities/dict.entity';
import { DictItem } from './entities/dict-item.entity';

@Injectable()
export class DictService {
  constructor(
    @InjectRepository(Dict) private dictRepo: Repository<Dict>,
    @InjectRepository(DictItem) private itemRepo: Repository<DictItem>,
  ) {}

  async findAll(): Promise<Dict[]> {
    return await this.dictRepo.find({ relations: ['items'] });
  }

  async findOne(id: string): Promise<Dict> {
    const dict = await this.dictRepo.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!dict) throw new NotFoundException('字典不存在');
    return dict;
  }

  async create(data: Partial<Dict>): Promise<Dict> {
    const dict = this.dictRepo.create(data);
    return await this.dictRepo.save(dict);
  }

  async update(id: string, data: Partial<Dict>): Promise<Dict> {
    const dict = await this.findOne(id);
    Object.assign(dict, data);
    return await this.dictRepo.save(dict);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.dictRepo.softDelete(id);
  }

  async findItemsByCode(code: string): Promise<DictItem[]> {
    const dict = await this.dictRepo.findOne({
      where: { dictCode: code },
      relations: ['items'],
    });
    return dict ? dict.items || [] : [];
  }
}
