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
import { ConfigService } from './config.service';
import { Config } from './entities/config.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('系统配置')
@Controller('configs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ConfigController {
  constructor(private configService: ConfigService) {}

  @Get()
  @ApiOperation({ summary: '获取配置列表' })
  findAll(): Promise<Config[]> {
    return this.configService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个配置' })
  findOne(@Param('id') id: string): Promise<Config> {
    return this.configService.findOne(id);
  }

  @Get('key/:key')
  @ApiOperation({ summary: '根据键获取配置值' })
  findByKey(@Param('key') key: string): Promise<string | null> {
    return this.configService.findByKey(key);
  }

  @Post()
  @ApiOperation({ summary: '创建配置' })
  create(@Body() data: Partial<Config>): Promise<Config> {
    return this.configService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新配置' })
  update(
    @Param('id') id: string,
    @Body() data: Partial<Config>,
  ): Promise<Config> {
    return this.configService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除配置' })
  remove(@Param('id') id: string): Promise<void> {
    return this.configService.remove(id);
  }
}
