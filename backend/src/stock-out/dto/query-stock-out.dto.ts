import {
  IsOptional,
  IsEnum,
  IsDateString,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryStockOutDto {
  @ApiPropertyOptional({ description: '页码', minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: '每页条数', minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10;

  @ApiPropertyOptional({
    description: '出库类型',
    enum: ['sale', 'material', 'scrap', 'adjustment'],
  })
  @IsOptional()
  @IsEnum(['sale', 'material', 'scrap', 'adjustment'])
  type?: 'sale' | 'material' | 'scrap' | 'adjustment';

  @ApiPropertyOptional({
    description: '状态',
    enum: ['pending', 'completed', 'cancelled'],
  })
  @IsOptional()
  @IsEnum(['pending', 'completed', 'cancelled'])
  status?: 'pending' | 'completed' | 'cancelled';

  @ApiPropertyOptional({ description: '开始日期' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: '结束日期' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
