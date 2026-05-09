import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsDateString,
  IsUUID,
  IsInt,
  IsNumber,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SalesOrderStatus, SalesPaymentStatus } from '../entities/sales-order.entity';

export class SalesOrderItemDto {
  @ApiProperty({ description: '产品ID' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: '数量' })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: '单价' })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiPropertyOptional({ description: '税率(%)', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  taxRate?: number;
}

export class CreateSalesOrderDto {
  @ApiProperty({ description: '客户ID' })
  @IsUUID()
  customerId: string;

  @ApiPropertyOptional({ description: '交货日期' })
  @IsOptional()
  @IsDateString()
  deliveryDate?: string;

  @ApiProperty({ description: '订单明细' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalesOrderItemDto)
  items: SalesOrderItemDto[];

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateSalesOrderDto {
  @ApiPropertyOptional({
    description: '订单状态',
    enum: ['draft', 'confirmed', 'shipped', 'delivered', 'cancelled'],
  })
  @IsOptional()
  @IsEnum(SalesOrderStatus)
  status?: SalesOrderStatus;

  @ApiPropertyOptional({
    description: '付款状态',
    enum: ['unpaid', 'partial', 'paid'],
  })
  @IsOptional()
  @IsEnum(SalesPaymentStatus)
  paymentStatus?: SalesPaymentStatus;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class QuerySalesOrderDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  pageSize?: number = 10;

  @ApiPropertyOptional({ description: '关键词(搜索订单编号)' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    description: '订单状态筛选',
    enum: ['draft', 'confirmed', 'shipped', 'delivered', 'cancelled'],
  })
  @IsOptional()
  @IsEnum(SalesOrderStatus)
  status?: SalesOrderStatus;

  @ApiPropertyOptional({
    description: '付款状态筛选',
    enum: ['unpaid', 'partial', 'paid'],
  })
  @IsOptional()
  @IsEnum(SalesPaymentStatus)
  paymentStatus?: SalesPaymentStatus;
}
