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
import { toNumber } from '../../common/utils/to-number.util';

export class QueryStockInDto {
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
    description: '入库类型',
    enum: ['purchase', 'return', 'production', 'adjustment'],
  })
  @IsOptional()
  @IsEnum(['purchase', 'return', 'production', 'adjustment'])
  type?: 'purchase' | 'return' | 'production' | 'adjustment';

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
