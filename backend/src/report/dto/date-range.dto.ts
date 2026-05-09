import { IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class DateRangeDto {
  @ApiPropertyOptional({ description: '开始日期', example: '2025-01-01' })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({ description: '结束日期', example: '2025-12-31' })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  endDate?: Date;

  @ApiPropertyOptional({ description: '仓库ID筛选', example: 'uuid-string' })
  @IsOptional()
  @IsString()
  warehouseId?: string;
}
