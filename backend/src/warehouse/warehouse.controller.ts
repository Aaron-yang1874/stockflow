import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { QueryWarehouseDto } from './dto/query-warehouse.dto';

@ApiTags('仓库管理')
@ApiBearerAuth()
@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  @ApiOperation({ summary: '创建仓库' })
  @ApiResponse({ status: 201, description: '创建成功' })
  create(@Body() dto: CreateWarehouseDto) {
    return this.warehouseService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '分页查询仓库列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Query() query: QueryWarehouseDto) {
    return this.warehouseService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取仓库详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findOne(@Param('id') id: string) {
    return this.warehouseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新仓库信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  update(@Param('id') id: string, @Body() dto: UpdateWarehouseDto) {
    return this.warehouseService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除仓库' })
  @ApiResponse({ status: 200, description: '删除成功' })
  remove(@Param('id') id: string) {
    return this.warehouseService.remove(id);
  }
}
