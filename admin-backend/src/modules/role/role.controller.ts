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
import { RoleService } from './role.service';
import { Role } from './entities/role.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('角色管理')
@Controller('roles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  @ApiOperation({ summary: '获取角色列表' })
  findAll(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个角色' })
  findOne(@Param('id') id: string): Promise<Role> {
    return this.roleService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '创建角色' })
  create(@Body() data: Partial<Role>): Promise<Role> {
    return this.roleService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新角色' })
  update(@Param('id') id: string, @Body() data: Partial<Role>): Promise<Role> {
    return this.roleService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除角色' })
  remove(@Param('id') id: string): Promise<void> {
    return this.roleService.remove(id);
  }
}
