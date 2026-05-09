import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { DictItem } from './dict-item.entity';

@Entity('sys_dict')
export class Dict extends BaseEntity {
  @Column({ name: 'dict_name', type: 'varchar', length: 50 })
  @ApiProperty({ description: '字典名称' })
  dictName: string;

  @Column({ name: 'dict_code', type: 'varchar', length: 50, unique: true })
  @ApiProperty({ description: '字典编码' })
  dictCode: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态:0禁用,1正常' })
  @ApiProperty({ description: '状态:0禁用,1正常' })
  status: number;

  @Column({ name: 'remark', type: 'varchar', length: 500, nullable: true })
  @ApiProperty({ description: '备注', nullable: true })
  remark?: string;

  @OneToMany(() => DictItem, (item) => item.dict)
  @ApiProperty({ description: '字典项列表', type: () => [DictItem] })
  items?: DictItem[];
}
