import {
  IsEnum,
  IsOptional,
  IsUUID,
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateStockInItemDto } from './create-stock-in-item.dto';

export class CreateStockInDto {
  @ApiProperty({
    description: '入库类型',
    enum: ['purchase', 'return', 'production', 'adjustment'],
  })
  @IsEnum(['purchase', 'return', 'production', 'adjustment'])
  type: 'purchase' | 'return' | 'production' | 'adjustment';

  @ApiPropertyOptional({ description: '供应商ID', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  supplierId?: string;

  @ApiProperty({ description: '仓库ID', format: 'uuid' })
  @IsUUID()
  warehouseId: string;

  @ApiProperty({
    description: '入库明细',
    type: [CreateStockInItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStockInItemDto)
  items: CreateStockInItemDto[];

  @ApiPropertyOptional({ description: '备注', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remark?: string;
}
