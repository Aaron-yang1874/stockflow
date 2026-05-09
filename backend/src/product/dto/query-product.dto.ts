import { IsOptional, IsNumber, IsString, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryProductDto {
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

  @ApiPropertyOptional({ example: '螺丝', description: '关键词搜索' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ example: '紧固件', description: '分类筛选' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'active', description: '状态筛选' })
  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';
}
