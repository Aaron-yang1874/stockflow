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
import { CustomerService } from './customer.service';
import { CreateCustomerDto, UpdateCustomerDto, QueryCustomerDto } from './dto/customer.dto';
import { Customer } from './entities/customer.entity';

@ApiTags('客户管理')
@ApiBearerAuth()
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @ApiOperation({ summary: '创建客户' })
  @ApiResponse({ status: 201, description: '创建成功', type: Customer })
  async create(@Body() dto: CreateCustomerDto) {
    return this.customerService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '分页查询客户列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findAll(@Query() query: QueryCustomerDto) {
    return this.customerService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取客户详情' })
  @ApiResponse({ status: 200, description: '查询成功', type: Customer })
  async findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新客户信息' })
  @ApiResponse({ status: 200, description: '更新成功', type: Customer })
  async update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.customerService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除客户' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}
