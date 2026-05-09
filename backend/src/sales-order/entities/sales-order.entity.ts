import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, Min } from 'class-validator';
import { Customer } from '../../customer/entities/customer.entity';

export enum SalesOrderStatus {
  DRAFT = 'draft',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum SalesPaymentStatus {
  UNPAID = 'unpaid',
  PARTIAL = 'partial',
  PAID = 'paid',
}

@Entity()
export class SalesOrder {
  @ApiProperty({ description: '销售订单ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '订单编号(唯一)' })
  @Column({ unique: true })
  orderNo: string;

  @ApiProperty({ description: '客户ID' })
  @Column()
  customerId: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @ApiProperty({ description: '总金额' })
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number;

  @ApiProperty({ description: '税额' })
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxAmount: number;

  @ApiProperty({ description: '折扣金额' })
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  discountAmount: number;

  @ApiProperty({ description: '最终金额' })
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  finalAmount: number;

  @ApiProperty({
    description: '订单状态',
    enum: ['draft', 'confirmed', 'shipped', 'delivered', 'cancelled'],
  })
  @Column({
    type: 'enum',
    enum: SalesOrderStatus,
    default: SalesOrderStatus.DRAFT,
  })
  @IsEnum(SalesOrderStatus)
  status: SalesOrderStatus;

  @ApiProperty({
    description: '付款状态',
    enum: ['unpaid', 'partial', 'paid'],
  })
  @Column({
    type: 'enum',
    enum: SalesPaymentStatus,
    default: SalesPaymentStatus.UNPAID,
  })
  @IsEnum(SalesPaymentStatus)
  paymentStatus: SalesPaymentStatus;

  @ApiProperty({ description: '交货日期', required: false })
  @Column({ nullable: true, type: 'date' })
  deliveryDate: Date;

  @ApiProperty({ description: '备注', required: false })
  @Column({ nullable: true })
  remark: string;

  @ApiProperty({ description: '操作人' })
  @Column()
  operatedBy: string;

  @OneToMany('SalesOrderItem', 'order')
  items: any[];

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updatedAt: Date;
}
