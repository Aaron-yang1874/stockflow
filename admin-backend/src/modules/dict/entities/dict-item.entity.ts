import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Dict } from './dict.entity';

@Entity('sys_dict_item')
export class DictItem extends BaseEntity {
  @Column({ name: 'dict_id', type: 'uuid' })
  @ApiProperty({ description: '字典ID' })
  dictId: string;

  @ManyToOne(() => Dict, (dict) => dict.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dict_id' })
  @ApiProperty({ description: '所属字典', type: () => Dict })
  dict: Dict;

  @Column({ name: 'label', type: 'varchar', length: 50 })
  @ApiProperty({ description: '字典标签' })
  label: string;

  @Column({ name: 'value', type: 'varchar', length: 50 })
  @ApiProperty({ description: '字典值' })
  value: string;

  @Column({ name: 'order_num', type: 'int', default: 0 })
  @ApiProperty({ description: '显示顺序' })
  orderNum: number;

  @Column({ name: 'list_class', type: 'varchar', length: 20, nullable: true })
  @ApiProperty({ description: '样式属性', nullable: true })
  listClass?: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态:0禁用,1正常' })
  @ApiProperty({ description: '状态:0禁用,1正常' })
  status: number;

  @Column({ name: 'remark', type: 'varchar', length: 500, nullable: true })
  @ApiProperty({ description: '备注', nullable: true })
  remark?: string;
}
