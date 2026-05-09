import {
  IsString,
  IsOptional,
  IsEmail,
  IsInt,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SupplierStatus } from '../entities/supplier.entity';

export class CreateSupplierDto {
  @ApiProperty({ description: '供应商唯一编码' })
  @IsString()
  code: string;

  @ApiProperty({ description: '供应商名称' })
  @IsString()
  name: string;

  @ApiProperty({ description: '联系人' })
  @IsString()
  contactPerson: string;

  @ApiProperty({ description: '联系电话' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: '地址' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: '开户银行' })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional({ description: '银行账号' })
  @IsOptional()
  @IsString()
  bankAccount?: string;

  @ApiPropertyOptional({ description: '税号' })
  @IsOptional()
  @IsString()
  taxNo?: string;

  @ApiPropertyOptional({ description: '评分(1-5)', minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateSupplierDto {
  @ApiPropertyOptional({ description: '供应商名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '联系人' })
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @ApiPropertyOptional({ description: '联系电话' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: '地址' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: '开户银行' })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional({ description: '银行账号' })
  @IsOptional()
  @IsString()
  bankAccount?: string;

  @ApiPropertyOptional({ description: '税号' })
  @IsOptional()
  @IsString()
  taxNo?: string;

  @ApiPropertyOptional({ description: '评分(1-5)', minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({
    description: '状态',
    enum: ['active', 'inactive'],
  })
  @IsOptional()
  @IsEnum(SupplierStatus)
  status?: SupplierStatus;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class QuerySupplierDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  pageSize?: number = 10;

  @ApiPropertyOptional({ description: '关键词(搜索名称/编码/联系人)' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    description: '状态筛选',
    enum: ['active', 'inactive'],
  })
  @IsOptional()
  @IsEnum(SupplierStatus)
  status?: SupplierStatus;
}
