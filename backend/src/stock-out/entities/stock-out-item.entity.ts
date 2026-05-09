import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StockOut } from './stock-out.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class StockOutItem {
  @ApiProperty({ description: '子项ID', format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '出库单ID', format: 'uuid' })
  @Column()
  stockOutId: string;

  @ApiProperty({ description: '产品ID', format: 'uuid' })
  @Column()
  productId: string;

  @ApiProperty({ description: '数量' })
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  quantity: number;

  @ApiProperty({ description: '单价' })
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unitPrice: number;

  @ApiProperty({ description: '金额' })
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @ManyToOne(() => StockOut, (stockOut) => stockOut.items)
  @JoinColumn({ name: 'stockOutId' })
  stockOut: StockOut;
}
