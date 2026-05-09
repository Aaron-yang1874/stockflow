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
import { Supplier } from '../../supplier/entities/supplier.entity';

export enum PurchaseOrderStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PARTIAL = 'partial',
  RECEIVED = 'received',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PARTIAL = 'partial',
  PAID = 'paid',
}

@Entity()
export class PurchaseOrder {
  @ApiProperty({ description: '采购订单ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '订单编号(唯一)' })
  @Column({ unique: true })
  orderNo: string;

  @ApiProperty({ description: '供应商ID' })
  @Column()
  supplierId: string;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplierId' })
  supplier: Supplier;

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
    enum: ['draft', 'sent', 'partial', 'received', 'cancelled'],
  })
  @Column({
    type: 'enum',
    enum: PurchaseOrderStatus,
    default: PurchaseOrderStatus.DRAFT,
  })
  @IsEnum(PurchaseOrderStatus)
  status: PurchaseOrderStatus;

  @ApiProperty({
    description: '付款状态',
    enum: ['unpaid', 'partial', 'paid'],
  })
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @ApiProperty({ description: '预计到货日期', required: false })
  @Column({ nullable: true, type: 'date' })
  expectedDate: Date;

  @ApiProperty({ description: '备注', required: false })
  @Column({ nullable: true })
  remark: string;

  @ApiProperty({ description: '操作人' })
  @Column()
  operatedBy: string;

  @OneToMany('PurchaseOrderItem', 'order')
  items: any[];

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updatedAt: Date;
}
