import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, Min } from 'class-validator';

export enum CustomerLevel {
  NORMAL = 'normal',
  VIP = 'vip',
  KEY = 'key',
}

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity()
export class Customer {
  @ApiProperty({ description: '客户ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '客户唯一编码' })
  @Column({ unique: true })
  code: string;

  @ApiProperty({ description: '客户名称' })
  @Column()
  name: string;

  @ApiProperty({ description: '联系人' })
  @Column()
  contactPerson: string;

  @ApiProperty({ description: '联系电话' })
  @Column()
  phone: string;

  @ApiProperty({ description: '邮箱', required: false })
  @Column({ nullable: true })
  email: string;

  @ApiProperty({ description: '地址', required: false })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({
    description: '客户等级',
    enum: ['normal', 'vip', 'key'],
  })
  @Column({
    type: 'enum',
    enum: CustomerLevel,
    default: CustomerLevel.NORMAL,
  })
  @IsEnum(CustomerLevel)
  level: CustomerLevel;

  @ApiProperty({ description: '信用额度' })
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  @IsNumber()
  @Min(0)
  creditLimit: number;

  @ApiProperty({
    description: '状态',
    enum: ['active', 'inactive'],
  })
  @Column({
    type: 'enum',
    enum: CustomerStatus,
    default: CustomerStatus.ACTIVE,
  })
  @IsEnum(CustomerStatus)
  status: CustomerStatus;

  @ApiProperty({ description: '备注', required: false })
  @Column({ nullable: true })
  remark: string;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updatedAt: Date;
}
