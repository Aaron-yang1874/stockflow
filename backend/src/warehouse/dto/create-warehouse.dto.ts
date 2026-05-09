import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWarehouseDto {
  @ApiProperty({ example: '主仓库', description: '仓库名称' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'WH-001', description: '仓库唯一编码' })
  @IsString()
  code: string;

  @ApiProperty({ example: '杭州市西湖区文三路100号', description: '地址' })
  @IsString()
  address: string;

  @ApiProperty({ example: '张三', description: '负责人' })
  @IsString()
  manager: string;

  @ApiProperty({ example: '13800138000', description: '联系电话' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ example: 5000, description: '库容(平方米)' })
  @IsOptional()
  @IsNumber()
  capacity?: number;
}
