import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';
import { SalesOrder } from './sales-order.entity';

@Entity()
export class SalesOrderItem {
  @ApiProperty({ description: '子项ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '所属订单ID' })
  @Column()
  orderId: string;

  @ManyToOne(() => SalesOrder, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: SalesOrder;

  @ApiProperty({ description: '产品ID' })
  @Column()
  productId: string;

  @ApiProperty({ description: '数量' })
  @Column({ type: 'int' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: '已发货数量' })
  @Column({ type: 'int', default: 0 })
  shippedQty: number;

  @ApiProperty({ description: '单价' })
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unitPrice: number;

  @ApiProperty({ description: '税率(%)' })
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxRate: number;

  @ApiProperty({ description: '金额' })
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;
}
