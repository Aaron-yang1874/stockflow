import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Warehouse } from '../../warehouse/entities/warehouse.entity';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;

  @Column()
  warehouseId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  quantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  reservedQty: number;

  @Column({ nullable: true })
  location: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
