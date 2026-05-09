import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { Inventory } from '../inventory/entities/inventory.entity';
import { Product } from '../product/entities/product.entity';
import { Warehouse } from '../warehouse/entities/warehouse.entity';
import { StockIn } from '../stock-in/entities/stock-in.entity';
import { StockOut } from '../stock-out/entities/stock-out.entity';
import { StockInItem } from '../stock-in/entities/stock-in-item.entity';
import { StockOutItem } from '../stock-out/entities/stock-out-item.entity';
import { PurchaseOrder } from '../purchase-order/entities/purchase-order.entity';
import { SalesOrder } from '../sales-order/entities/sales-order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inventory,
      Product,
      Warehouse,
      StockIn,
      StockOut,
      StockInItem,
      StockOutItem,
      PurchaseOrder,
      SalesOrder,
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
