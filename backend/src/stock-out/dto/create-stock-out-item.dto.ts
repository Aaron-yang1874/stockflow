import { IsNumber, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStockOutItemDto {
  @ApiProperty({ description: '产品ID', format: 'uuid' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: '数量' })
  @IsNumber()
  @Min(0.01)
  quantity: number;

  @ApiProperty({ description: '单价' })
  @IsNumber()
  @Min(0)
  unitPrice: number;
}
