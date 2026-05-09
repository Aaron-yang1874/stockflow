import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesOrderController } from './sales-order.controller';
import { SalesOrderService } from './sales-order.service';
import { SalesOrder } from './entities/sales-order.entity';
import { SalesOrderItem } from './entities/sales-order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SalesOrder, SalesOrderItem])],
  controllers: [SalesOrderController],
  providers: [SalesOrderService],
  exports: [SalesOrderService],
})
export class SalesOrderModule {}
