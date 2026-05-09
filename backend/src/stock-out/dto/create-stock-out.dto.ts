import {
  IsEnum,
  IsOptional,
  IsUUID,
  IsString,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateStockOutItemDto } from './create-stock-out-item.dto';

export class CreateStockOutDto {
  @ApiProperty({
    description: '出库类型',
    enum: ['sale', 'material', 'scrap', 'adjustment'],
  })
  @IsEnum(['sale', 'material', 'scrap', 'adjustment'])
  type: 'sale' | 'material' | 'scrap' | 'adjustment';

  @ApiPropertyOptional({ description: '客户ID', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiProperty({ description: '仓库ID', format: 'uuid' })
  @IsUUID()
  warehouseId: string;

  @ApiProperty({
    description: '出库明细',
    type: [CreateStockOutItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStockOutItemDto)
  items: CreateStockOutItemDto[];

  @ApiPropertyOptional({ description: '备注', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remark?: string;
}
