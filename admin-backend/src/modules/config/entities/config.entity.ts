import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('sys_config')
export class Config extends BaseEntity {
  @Column({ name: 'config_name', type: 'varchar', length: 50 })
  @ApiProperty({ description: '参数名称' })
  configName: string;

  @Column({ name: 'config_key', type: 'varchar', length: 50, unique: true })
  @ApiProperty({ description: '参数键名' })
  configKey: string;

  @Column({ name: 'config_value', type: 'varchar', length: 500 })
  @ApiProperty({ description: '参数键值' })
  configValue: string;

  @Column({
    name: 'config_type',
    type: 'char',
    length: 1,
    default: 'Y',
    comment: '系统内置:Y是,N否',
  })
  @ApiProperty({ description: '系统内置:Y是,N否' })
  configType: string;

  @Column({ name: 'remark', type: 'varchar', length: 500, nullable: true })
  @ApiProperty({ description: '备注', nullable: true })
  remark?: string;
}
