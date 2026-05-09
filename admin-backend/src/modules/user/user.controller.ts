import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('用户管理')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: '获取用户列表' })
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个用户' })
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '创建用户' })
  create(@Body() data: Partial<User>): Promise<User> {
    return this.userService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新用户' })
  update(@Param('id') id: string, @Body() data: Partial<User>): Promise<User> {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
