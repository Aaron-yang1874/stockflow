import { IsString, IsNotEmpty, MinLength, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: '真实姓名', required: false })
  @IsString()
  @IsOptional()
  realName?: string;

  @ApiProperty({ description: '邮箱', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;
}
