import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';

@Injectable()
export class FileService {
  constructor(@InjectRepository(File) private fileRepo: Repository<File>) {}

  async findAll(): Promise<File[]> {
    return await this.fileRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<File> {
    const file = await this.fileRepo.findOne({ where: { id } });
    if (!file) throw new NotFoundException('文件不存在');
    return file;
  }

  async create(data: Partial<File>): Promise<File> {
    const file = this.fileRepo.create(data);
    return await this.fileRepo.save(file);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.fileRepo.softDelete(id);
  }
}
