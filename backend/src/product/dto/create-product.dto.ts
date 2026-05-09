import { IsString, IsNumber, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'SKU-001', description: '产品唯一编码' })
  @IsNotEmpty()
  @IsString()
  sku: string;

  @ApiProperty({ example: '螺丝M6x20', description: '产品名称' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '紧固件', description: '产品分类' })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({ example: '个', description: '计量单位' })
  @IsNotEmpty()
  @IsString()
  unit: string;

  @ApiPropertyOptional({ example: 'M6x20不锈钢', description: '规格' })
  @IsOptional()
  @IsString()
  spec?: string;

  @ApiProperty({ example: 0.5, description: '成本价' })
  @IsNotEmpty()
  @IsNumber()
  costPrice: number;

  @ApiProperty({ example: 1.2, description: '销售价' })
  @IsNotEmpty()
  @IsNumber()
  salePrice: number;

  @ApiProperty({ example: 100, description: '最低库存预警值' })
  @IsNotEmpty()
  @IsNumber()
  minStock: number;

  @ApiPropertyOptional({ example: '高强度不锈钢螺丝', description: '描述' })
  @IsOptional()
  @IsString()
  description?: string;
}
