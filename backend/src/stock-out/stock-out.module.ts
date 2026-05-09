import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockOutController } from './stock-out.controller';
import { StockOutService } from './stock-out.service';
import { StockOut } from './entities/stock-out.entity';
import { StockOutItem } from './entities/stock-out-item.entity';
import { Inventory } from '../inventory/entities/inventory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockOut, StockOutItem, Inventory]),
  ],
  controllers: [StockOutController],
  providers: [StockOutService],
  exports: [StockOutService],
})
export class StockOutModule {}
