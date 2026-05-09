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
import { StockInService } from './stock-in.service';
import { CreateStockInDto } from './dto/create-stock-in.dto';
import { UpdateStockInDto } from './dto/update-stock-in.dto';
import { QueryStockInDto } from './dto/query-stock-in.dto';

@ApiTags('入库管理')
@ApiBearerAuth()
@Controller('stock-in')
export class StockInController {
  constructor(private readonly stockInService: StockInService) {}

  @Post()
  @ApiOperation({ summary: '创建入库单' })
  @ApiResponse({ status: 201, description: '创建成功' })
  create(@Body() dto: CreateStockInDto, @Req() req: any) {
    const operatedBy = req.user?.username ?? 'system';
    return this.stockInService.create(dto, operatedBy);
  }

  @Get()
  @ApiOperation({ summary: '查询入库单列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Query() query: QueryStockInDto) {
    return this.stockInService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID查询入库单详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findOne(@Param('id') id: string) {
    return this.stockInService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新入库单' })
  @ApiResponse({ status: 200, description: '更新成功' })
  update(@Param('id') id: string, @Body() dto: UpdateStockInDto) {
    return this.stockInService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除入库单' })
  @ApiResponse({ status: 200, description: '删除成功' })
  remove(@Param('id') id: string) {
    return this.stockInService.remove(id);
  }
}
