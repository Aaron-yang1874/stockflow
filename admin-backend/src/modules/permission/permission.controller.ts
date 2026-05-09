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
import { PermissionService } from './permission.service';
import { Permission } from './entities/permission.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('权限/菜单管理')
@Controller('permissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PermissionController {
  constructor(private permService: PermissionService) {}

  @Get()
  @ApiOperation({ summary: '获取权限/菜单列表' })
  findAll(): Promise<Permission[]> {
    return this.permService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个权限/菜单' })
  findOne(@Param('id') id: string): Promise<Permission> {
    return this.permService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '创建权限/菜单' })
  create(@Body() data: Partial<Permission>): Promise<Permission> {
    return this.permService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新权限/菜单' })
  update(
    @Param('id') id: string,
    @Body() data: Partial<Permission>,
  ): Promise<Permission> {
    return this.permService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除权限/菜单' })
  remove(@Param('id') id: string): Promise<void> {
    return this.permService.remove(id);
  }
}
