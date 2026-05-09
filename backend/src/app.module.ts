import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ProductModule } from './product/product.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { InventoryModule } from './inventory/inventory.module';
import { StockInModule } from './stock-in/stock-in.module';
import { StockOutModule } from './stock-out/stock-out.module';
import { SupplierModule } from './supplier/supplier.module';
import { CustomerModule } from './customer/customer.module';
import { PurchaseOrderModule } from './purchase-order/purchase-order.module';
import { SalesOrderModule } from './sales-order/sales-order.module';
import { ReportModule } from './report/report.module';
import { Product } from './product/entities/product.entity';
import { Warehouse } from './warehouse/entities/warehouse.entity';
import { Inventory } from './inventory/entities/inventory.entity';
import { StockIn } from './stock-in/entities/stock-in.entity';
import { StockOut } from './stock-out/entities/stock-out.entity';
import { Supplier } from './supplier/entities/supplier.entity';
import { Customer } from './customer/entities/customer.entity';
import { PurchaseOrder } from './purchase-order/entities/purchase-order.entity';
import { SalesOrder } from './sales-order/entities/sales-order.entity';
import { PurchaseOrderItem } from './purchase-order/entities/purchase-order-item.entity';
import { SalesOrderItem } from './sales-order/entities/sales-order-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [
          Product,
          Warehouse,
          Inventory,
          StockIn,
          StockOut,
          Supplier,
          Customer,
          PurchaseOrder,
          SalesOrder,
          PurchaseOrderItem,
          SalesOrderItem,
        ],
        synchronize: true,
        logging: config.get('NODE_ENV') === 'development',
      }),
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'single',
        url: `redis://${config.get('REDIS_HOST')}:${config.get('REDIS_PORT')}`,
      }),
    }),
    ProductModule,
    WarehouseModule,
    InventoryModule,
    StockInModule,
    StockOutModule,
    SupplierModule,
    CustomerModule,
    PurchaseOrderModule,
    SalesOrderModule,
    ReportModule,
  ],
})
export class AppModule {}