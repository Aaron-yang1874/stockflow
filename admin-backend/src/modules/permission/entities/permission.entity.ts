import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Role } from '../../role/entities/role.entity';

@Entity('sys_permission')
export class Permission extends BaseEntity {
  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  @ApiProperty({ description: '父菜单ID', nullable: true })
  parentId?: string;

  @ManyToOne(() => Permission, (perm) => perm.children, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  @ApiProperty({ description: '父菜单', type: () => Permission })
  parent?: Permission;

  @OneToMany(() => Permission, (perm) => perm.parent)
  @ApiProperty({ description: '子菜单列表', type: () => [Permission] })
  children?: Permission[];

  @Column({
    name: 'menu_type',
    type: 'char',
    length: 1,
    comment: '菜单类型:M目录,C菜单,F按钮',
  })
  @ApiProperty({ description: '菜单类型:M目录,C菜单,F按钮' })
  menuType: string;

  @Column({ name: 'menu_name', type: 'varchar', length: 50 })
  @ApiProperty({ description: '菜单名称' })
  menuName: string;

  @Column({ name: 'order_num', type: 'int', default: 0 })
  @ApiProperty({ description: '显示顺序' })
  orderNum: number;

  @Column({ name: 'path', type: 'varchar', length: 200, nullable: true })
  @ApiProperty({ description: '路由地址', nullable: true })
  path?: string;

  @Column({ name: 'component', type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: '组件路径', nullable: true })
  component?: string;

  @Column({ name: 'query', type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: '路由参数', nullable: true })
  query?: string;

  @Column({ name: 'is_frame', type: 'tinyint', default: 1, comment: '是否外链:0是,1否' })
  @ApiProperty({ description: '是否外链:0是,1否' })
  isFrame: number;

  @Column({ name: 'is_cache', type: 'tinyint', default: 1, comment: '是否缓存:0否,1是' })
  @ApiProperty({ description: '是否缓存:0否,1是' })
  isCache: number;

  @Column({ name: 'visible', type: 'tinyint', default: 1, comment: '显示状态:0隐藏,1显示' })
  @ApiProperty({ description: '显示状态:0隐藏,1显示' })
  visible: number;

  @Column({ type: 'tinyint', default: 1, comment: '状态:0禁用,1正常' })
  @ApiProperty({ description: '状态:0禁用,1正常' })
  status: number;

  @Column({ name: 'perms', type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: '权限标识', nullable: true })
  perms?: string;

  @Column({ name: 'icon', type: 'varchar', length: 100, default: '#' })
  @ApiProperty({ description: '菜单图标' })
  icon: string;

  @Column({ name: 'remark', type: 'varchar', length: 500, nullable: true })
  @ApiProperty({ description: '备注', nullable: true })
  remark?: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  @ApiProperty({ description: '角色列表', type: () => [Role] })
  roles?: Role[];
}
