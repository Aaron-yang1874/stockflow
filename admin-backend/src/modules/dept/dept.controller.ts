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
import { DeptService } from './dept.service';
import { Dept } from './entities/dept.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('部门管理')
@Controller('depts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DeptController {
  constructor(private deptService: DeptService) {}

  @Get()
  @ApiOperation({ summary: '获取部门列表' })
  findAll(): Promise<Dept[]> {
    return this.deptService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个部门' })
  findOne(@Param('id') id: string): Promise<Dept> {
    return this.deptService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '创建部门' })
  create(@Body() data: Partial<Dept>): Promise<Dept> {
    return this.deptService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新部门' })
  update(@Param('id') id: string, @Body() data: Partial<Dept>): Promise<Dept> {
    return this.deptService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除部门' })
  remove(@Param('id') id: string): Promise<void> {
    return this.deptService.remove(id);
  }
}
