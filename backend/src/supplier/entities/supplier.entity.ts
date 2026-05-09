import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, Max, Min } from 'class-validator';

export enum SupplierStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity()
export class Supplier {
  @ApiProperty({ description: '供应商ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '供应商唯一编码' })
  @Column({ unique: true })
  code: string;

  @ApiProperty({ description: '供应商名称' })
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

  @ApiProperty({ description: '开户银行', required: false })
  @Column({ nullable: true })
  bankName: string;

  @ApiProperty({ description: '银行账号', required: false })
  @Column({ nullable: true })
  bankAccount: string;

  @ApiProperty({ description: '税号', required: false })
  @Column({ nullable: true })
  taxNo: string;

  @ApiProperty({ description: '评分(1-5)', minimum: 1, maximum: 5 })
  @Column({ type: 'int', default: 3 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: '状态', enum: ['active', 'inactive'] })
  @Column({
    type: 'enum',
    enum: SupplierStatus,
    default: SupplierStatus.ACTIVE,
  })
  @IsEnum(SupplierStatus)
  status: SupplierStatus;

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
