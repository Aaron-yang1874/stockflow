import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('sys_dept')
export class Dept extends BaseEntity {
  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  @ApiProperty({ description: '父部门ID', nullable: true })
  parentId?: string;

  @ManyToOne(() => Dept, (dept) => dept.children, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  @ApiProperty({ description: '父部门', type: () => Dept })
  parent?: Dept;

  @OneToMany(() => Dept, (dept) => dept.parent)
  @ApiProperty({ description: '子部门列表', type: () => [Dept] })
  children?: Dept[];

  @Column({ name: 'dept_name', type: 'varchar', length: 50 })
  @ApiProperty({ description: '部门名称' })
  deptName: string;

  @Column({ name: 'order_num', type: 'int', default: 0 })
  @ApiProperty({ description: '显示顺序' })
  orderNum: number;

  @Column({ name: 'leader', type: 'varchar', length: 20, nullable: true })
  @ApiProperty({ description: '负责人', nullable: true })
  leader?: string;

  @Column({ name: 'phone', type: 'varchar', length: 11, nullable: true })
  @ApiProperty({ description: '联系电话', nullable: true })
  phone?: string;

  @Column({ name: 'email', type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: '邮箱', nullable: true })
  email?: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态:0禁用,1正常' })
  @ApiProperty({ description: '状态:0禁用,1正常' })
  status: number;
}
