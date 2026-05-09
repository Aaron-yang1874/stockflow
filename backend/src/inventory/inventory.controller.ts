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
import { InventoryService } from './inventory.service';
import { QueryInventoryDto } from './dto/query-inventory.dto';

@ApiTags('库存管理')
@ApiBearerAuth()
@Controller('inventories')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @ApiOperation({ summary: '创建库存记录' })
  @ApiResponse({ status: 201, description: '创建成功' })
  create(@Body() data: Record<string, any>) {
    return this.inventoryService.create(data);
  }

  @Get()
  @ApiOperation({ summary: '分页查询库存列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Query() query: QueryInventoryDto) {
    return this.inventoryService.findAll(query);
  }

  @Get('low-stock/alerts')
  @ApiOperation({ summary: '获取低库存预警列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  getLowStockAlerts() {
    return this.inventoryService.getLowStockAlerts();
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取库存详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新库存信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  update(@Param('id') id: string, @Body() data: Record<string, any>) {
    return this.inventoryService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除库存记录' })
  @ApiResponse({ status: 200, description: '删除成功' })
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }
}
