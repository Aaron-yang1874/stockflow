import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('sys_log_operation')
export class LogOperation extends BaseEntity {
  @Column({ name: 'module', type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: '模块名称', nullable: true })
  module?: string;

  @Column({ name: 'business_type', type: 'varchar', length: 20, nullable: true })
  @ApiProperty({ description: '业务类型', nullable: true })
  businessType?: string;

  @Column({ name: 'method', type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: '请求方法', nullable: true })
  method?: string;

  @Column({ name: 'request_method', type: 'varchar', length: 10, nullable: true })
  @ApiProperty({ description: '请求方式', nullable: true })
  requestMethod?: string;

  @Column({ name: 'operator_type', type: 'varchar', length: 20, nullable: true })
  @ApiProperty({ description: '操作类别', nullable: true })
  operatorType?: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  @ApiProperty({ description: '用户ID', nullable: true })
  userId?: string;

  @Column({ name: 'username', type: 'varchar', length: 30, nullable: true })
  @ApiProperty({ description: '操作用户名', nullable: true })
  username?: string;

  @Column({ name: 'dept_name', type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: '部门名称', nullable: true })
  deptName?: string;

  @Column({ name: 'request_url', type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: '请求URL', nullable: true })
  requestUrl?: string;

  @Column({ name: 'request_ip', type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: '请求IP', nullable: true })
  requestIp?: string;

  @Column({ name: 'request_location', type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: '请求地点', nullable: true })
  requestLocation?: string;

  @Column({ name: 'request_params', type: 'text', nullable: true })
  @ApiProperty({ description: '请求参数', nullable: true })
  requestParams?: string;

  @Column({ name: 'response_result', type: 'text', nullable: true })
  @ApiProperty({ description: '响应结果', nullable: true })
  responseResult?: string;

  @Column({ type: 'tinyint', default: 0, comment: '操作状态:0正常,1异常' })
  @ApiProperty({ description: '操作状态:0正常,1异常' })
  status: number;

  @Column({ name: 'error_msg', type: 'text', nullable: true })
  @ApiProperty({ description: '错误消息', nullable: true })
  errorMsg?: string;

  @Column({ name: 'cost_time', type: 'bigint', default: 0 })
  @ApiProperty({ description: '消耗时间(ms)' })
  costTime: number;
}
