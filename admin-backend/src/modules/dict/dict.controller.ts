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
import { DictService } from './dict.service';
import { Dict } from './entities/dict.entity';
import { DictItem } from './entities/dict-item.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('字典管理')
@Controller('dicts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DictController {
  constructor(private dictService: DictService) {}

  @Get()
  @ApiOperation({ summary: '获取字典列表' })
  findAll(): Promise<Dict[]> {
    return this.dictService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个字典' })
  findOne(@Param('id') id: string): Promise<Dict> {
    return this.dictService.findOne(id);
  }

  @Get('code/:code/items')
  @ApiOperation({ summary: '根据编码获取字典项' })
  findItemsByCode(@Param('code') code: string): Promise<DictItem[]> {
    return this.dictService.findItemsByCode(code);
  }

  @Post()
  @ApiOperation({ summary: '创建字典' })
  create(@Body() data: Partial<Dict>): Promise<Dict> {
    return this.dictService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新字典' })
  update(@Param('id') id: string, @Body() data: Partial<Dict>): Promise<Dict> {
    return this.dictService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除字典' })
  remove(@Param('id') id: string): Promise<void> {
    return this.dictService.remove(id);
  }
}
