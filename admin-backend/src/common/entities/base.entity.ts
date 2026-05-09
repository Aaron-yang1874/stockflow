import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: '主键ID' })
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  @ApiProperty({ description: '删除时间', nullable: true })
  deletedAt?: Date;
}
