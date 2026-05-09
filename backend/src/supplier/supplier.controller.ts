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
import { SupplierService } from './supplier.service';
import { CreateSupplierDto, UpdateSupplierDto, QuerySupplierDto } from './dto/supplier.dto';
import { Supplier } from './entities/supplier.entity';

@ApiTags('供应商管理')
@ApiBearerAuth()
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @ApiOperation({ summary: '创建供应商' })
  @ApiResponse({ status: 201, description: '创建成功', type: Supplier })
  async create(@Body() dto: CreateSupplierDto) {
    return this.supplierService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '分页查询供应商列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findAll(@Query() query: QuerySupplierDto) {
    return this.supplierService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取供应商详情' })
  @ApiResponse({ status: 200, description: '查询成功', type: Supplier })
  async findOne(@Param('id') id: string) {
    return this.supplierService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新供应商信息' })
  @ApiResponse({ status: 200, description: '更新成功', type: Supplier })
  async update(@Param('id') id: string, @Body() dto: UpdateSupplierDto) {
    return this.supplierService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除供应商' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('id') id: string) {
    return this.supplierService.remove(id);
  }
}
