import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { StockInItem } from './stock-in-item.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class StockIn {
  @ApiProperty({ description: '入库单ID', format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '入库单号', uniqueItems: true })
  @Column({ unique: true })
  orderNo: string;

  @ApiProperty({
    description: '入库类型',
    enum: ['purchase', 'return', 'production', 'adjustment'],
  })
  @Column({
    type: 'enum',
    enum: ['purchase', 'return', 'production', 'adjustment'],
  })
  type: 'purchase' | 'return' | 'production' | 'adjustment';

  @ApiPropertyOptional({ description: '供应商ID', format: 'uuid' })
  @Column({ nullable: true })
  supplierId: string | null;

  @ApiProperty({ description: '仓库ID', format: 'uuid' })
  @Column()
  warehouseId: string;

  @ApiProperty({ description: '总金额' })
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalAmount: number;

  @ApiProperty({
    description: '状态',
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  })
  @Column({
    type: 'enum',
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: 'pending' | 'completed' | 'cancelled';

  @ApiPropertyOptional({ description: '备注' })
  @Column({ nullable: true })
  remark: string | null;

  @ApiProperty({ description: '操作人' })
  @Column()
  operatedBy: string;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => StockInItem, (item) => item.stockIn, { cascade: true })
  items: StockInItem[];
}
