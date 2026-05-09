import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogOperation } from './entities/log-operation.entity';
import { LogLogin } from './entities/log-login.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(LogOperation)
    private operationRepo: Repository<LogOperation>,
    @InjectRepository(LogLogin)
    private loginRepo: Repository<LogLogin>,
  ) {}

  async findOperations(): Promise<LogOperation[]> {
    return await this.operationRepo.find({
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async findLogins(): Promise<LogLogin[]> {
    return await this.loginRepo.find({
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async createOperation(data: Partial<LogOperation>): Promise<LogOperation> {
    const log = this.operationRepo.create(data);
    return await this.operationRepo.save(log);
  }

  async createLogin(data: Partial<LogLogin>): Promise<LogLogin> {
    const log = this.loginRepo.create(data);
    return await this.loginRepo.save(log);
  }
}
