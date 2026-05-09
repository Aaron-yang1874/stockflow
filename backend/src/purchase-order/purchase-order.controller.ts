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
import { PurchaseOrderService } from './purchase-order.service';
import { CreatePurchaseOrderDto, UpdatePurchaseOrderDto, QueryPurchaseOrderDto } from './dto/purchase-order.dto';
import { PurchaseOrder } from './entities/purchase-order.entity';

@ApiTags('采购订单管理')
@ApiBearerAuth()
@Controller('purchase-orders')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Post()
  @ApiOperation({ summary: '创建采购订单' })
  @ApiResponse({ status: 201, description: '创建成功', type: PurchaseOrder })
  async create(@Body() dto: CreatePurchaseOrderDto) {
    return this.purchaseOrderService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '分页查询采购订单列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findAll(@Query() query: QueryPurchaseOrderDto) {
    return this.purchaseOrderService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取采购订单详情(含明细)' })
  @ApiResponse({ status: 200, description: '查询成功', type: PurchaseOrder })
  async findOne(@Param('id') id: string) {
    return this.purchaseOrderService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新采购订单(状态流转/修改备注等)' })
  @ApiResponse({ status: 200, description: '更新成功', type: PurchaseOrder })
  async update(@Param('id') id: string, @Body() dto: UpdatePurchaseOrderDto) {
    return this.purchaseOrderService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除采购订单(仅草稿/已取消状态可删)' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('id') id: string) {
    return this.purchaseOrderService.remove(id);
  }
}
