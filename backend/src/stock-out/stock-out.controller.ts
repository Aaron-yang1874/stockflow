import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StockOutService } from './stock-out.service';
import { CreateStockOutDto } from './dto/create-stock-out.dto';
import { UpdateStockOutDto } from './dto/update-stock-out.dto';
import { QueryStockOutDto } from './dto/query-stock-out.dto';

@ApiTags('出库管理')
@ApiBearerAuth()
@Controller('stock-out')
export class StockOutController {
  constructor(private readonly stockOutService: StockOutService) {}

  @Post()
  @ApiOperation({ summary: '创建出库单' })
  @ApiResponse({ status: 201, description: '创建成功' })
  create(@Body() dto: CreateStockOutDto, @Req() req: any) {
    const operatedBy = req.user?.username ?? 'system';
    return this.stockOutService.create(dto, operatedBy);
  }

  @Get()
  @ApiOperation({ summary: '查询出库单列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Query() query: QueryStockOutDto) {
    return this.stockOutService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID查询出库单详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findOne(@Param('id') id: string) {
    return this.stockOutService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新出库单' })
  @ApiResponse({ status: 200, description: '更新成功' })
  update(@Param('id') id: string, @Body() dto: UpdateStockOutDto) {
    return this.stockOutService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除出库单' })
  @ApiResponse({ status: 200, description: '删除成功' })
  remove(@Param('id') id: string) {
    return this.stockOutService.remove(id);
  }
}
