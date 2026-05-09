import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogOperation } from './entities/log-operation.entity';
import { LogLogin } from './entities/log-login.entity';
import { LogService } from './log.service';
import { LogController } from './log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LogOperation, LogLogin])],
  providers: [LogService],
  controllers: [LogController],
  exports: [LogService],
})
export class LogModule {}
