import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LogService } from './log.service';
import { LogOperation } from './entities/log-operation.entity';
import { LogLogin } from './entities/log-login.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('日志管理')
@Controller('logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LogController {
  constructor(private logService: LogService) {}

  @Get('operations')
  @ApiOperation({ summary: '获取操作日志' })
  findOperations(): Promise<LogOperation[]> {
    return this.logService.findOperations();
  }

  @Get('logins')
  @ApiOperation({ summary: '获取登录日志' })
  findLogins(): Promise<LogLogin[]> {
    return this.logService.findLogins();
  }

  @Post('operations')
  @ApiOperation({ summary: '创建操作日志' })
  createOperation(@Body() data: Partial<LogOperation>): Promise<LogOperation> {
    return this.logService.createOperation(data);
  }

  @Post('logins')
  @ApiOperation({ summary: '创建登录日志' })
  createLogin(@Body() data: Partial<LogLogin>): Promise<LogLogin> {
    return this.logService.createLogin(data);
  }
}
