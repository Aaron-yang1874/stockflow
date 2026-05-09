import { IsOptional, IsNumber, IsString, IsBoolean, IsUUID, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryInventoryDto {
  @ApiPropertyOptional({ example: 1, description: '页码' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, description: '每页条数' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize?: number = 20;

  @ApiPropertyOptional({ description: '仓库ID筛选' })
  @IsOptional()
  @IsUUID()
  warehouseId?: string;

  @ApiPropertyOptional({ description: '产品ID筛选' })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiPropertyOptional({ example: '螺丝', description: '关键词搜索(产品名称/SKU)' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: '仅显示低库存记录' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  lowStock?: boolean;
}
