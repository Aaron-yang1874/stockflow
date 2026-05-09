import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockInController } from './stock-in.controller';
import { StockInService } from './stock-in.service';
import { StockIn } from './entities/stock-in.entity';
import { StockInItem } from './entities/stock-in-item.entity';
import { Inventory } from '../inventory/entities/inventory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockIn, StockInItem, Inventory]),
  ],
  controllers: [StockInController],
  providers: [StockInService],
  exports: [StockInService],
})
export class StockInModule {}
