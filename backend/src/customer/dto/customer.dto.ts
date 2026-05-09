import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CustomerLevel, CustomerStatus } from '../entities/customer.entity';

export class CreateCustomerDto {
  @ApiProperty({ description: '客户唯一编码' })
  @IsString()
  code: string;

  @ApiProperty({ description: '客户名称' })
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

  @ApiPropertyOptional({
    description: '客户等级',
    enum: ['normal', 'vip', 'key'],
  })
  @IsOptional()
  @IsEnum(CustomerLevel)
  level?: CustomerLevel;

  @ApiPropertyOptional({ description: '信用额度' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  creditLimit?: number;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateCustomerDto {
  @ApiPropertyOptional({ description: '客户名称' })
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

  @ApiPropertyOptional({
    description: '客户等级',
    enum: ['normal', 'vip', 'key'],
  })
  @IsOptional()
  @IsEnum(CustomerLevel)
  level?: CustomerLevel;

  @ApiPropertyOptional({ description: '信用额度' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  creditLimit?: number;

  @ApiPropertyOptional({
    description: '状态',
    enum: ['active', 'inactive'],
  })
  @IsOptional()
  @IsEnum(CustomerStatus)
  status?: CustomerStatus;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class QueryCustomerDto {
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
  @IsEnum(CustomerStatus)
  status?: CustomerStatus;
}
