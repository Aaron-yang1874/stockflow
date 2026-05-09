import { IsOptional, IsEnum, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStockInDto {
  @ApiPropertyOptional({
    description: '状态',
    enum: ['pending', 'completed', 'cancelled'],
  })
  @IsOptional()
  @IsEnum(['pending', 'completed', 'cancelled'])
  status?: 'pending' | 'completed' | 'cancelled';

  @ApiPropertyOptional({ description: '备注', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remark?: string;
}
