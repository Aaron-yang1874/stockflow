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
import { SalesOrderService } from './sales-order.service';
import { CreateSalesOrderDto, UpdateSalesOrderDto, QuerySalesOrderDto } from './dto/sales-order.dto';
import { SalesOrder } from './entities/sales-order.entity';

@ApiTags('销售订单管理')
@ApiBearerAuth()
@Controller('sales-orders')
export class SalesOrderController {
  constructor(private readonly salesOrderService: SalesOrderService) {}

  @Post()
  @ApiOperation({ summary: '创建销售订单' })
  @ApiResponse({ status: 201, description: '创建成功', type: SalesOrder })
  async create(@Body() dto: CreateSalesOrderDto) {
    return this.salesOrderService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '分页查询销售订单列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findAll(@Query() query: QuerySalesOrderDto) {
    return this.salesOrderService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取销售订单详情(含明细)' })
  @ApiResponse({ status: 200, description: '查询成功', type: SalesOrder })
  async findOne(@Param('id') id: string) {
    return this.salesOrderService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新销售订单(状态流转/修改备注等)' })
  @ApiResponse({ status: 200, description: '更新成功', type: SalesOrder })
  async update(@Param('id') id: string, @Body() dto: UpdateSalesOrderDto) {
    return this.salesOrderService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除销售订单(仅草稿/已取消/已交付状态可删)' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('id') id: string) {
    return this.salesOrderService.remove(id);
  }
}
