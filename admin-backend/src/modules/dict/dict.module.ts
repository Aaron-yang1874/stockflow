import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dict } from './entities/dict.entity';
import { DictItem } from './entities/dict-item.entity';
import { DictService } from './dict.service';
import { DictController } from './dict.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Dict, DictItem])],
  providers: [DictService],
  controllers: [DictController],
  exports: [DictService],
})
export class DictModule {}
