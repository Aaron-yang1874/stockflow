import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StockIn } from './stock-in.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class StockInItem {
  @ApiProperty({ description: '子项ID', format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '入库单ID', format: 'uuid' })
  @Column()
  stockInId: string;

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

  @ManyToOne(() => StockIn, (stockIn) => stockIn.items)
  @JoinColumn({ name: 'stockInId' })
  stockIn: StockIn;
}
