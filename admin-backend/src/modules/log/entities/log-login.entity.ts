import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('sys_log_login')
export class LogLogin extends BaseEntity {
  @Column({ name: 'username', type: 'varchar', length: 30, nullable: true })
  @ApiProperty({ description: '用户名', nullable: true })
  username?: string;

  @Column({ name: 'ip_address', type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: '登录IP', nullable: true })
  ipAddress?: string;

  @Column({ name: 'login_location', type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: '登录地点', nullable: true })
  loginLocation?: string;

  @Column({ name: 'browser', type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: '浏览器', nullable: true })
  browser?: string;

  @Column({ name: 'os', type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: '操作系统', nullable: true })
  os?: string;

  @Column({ type: 'tinyint', default: 0, comment: '登录状态:0成功,1失败' })
  @ApiProperty({ description: '登录状态:0成功,1失败' })
  status: number;

  @Column({ name: 'msg', type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: '提示消息', nullable: true })
  msg?: string;

  @Column({ name: 'login_time', type: 'timestamp', nullable: true })
  @ApiProperty({ description: '登录时间', nullable: true })
  loginTime?: Date;
}
