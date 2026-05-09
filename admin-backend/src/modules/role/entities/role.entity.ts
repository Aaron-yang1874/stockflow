import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Permission } from '../../permission/entities/permission.entity';

@Entity('sys_role')
export class Role extends BaseEntity {
  @Column({ name: 'role_name', type: 'varchar', length: 30 })
  @ApiProperty({ description: '角色名称' })
  roleName: string;

  @Column({ name: 'role_code', type: 'varchar', length: 50, unique: true })
  @ApiProperty({ description: '角色编码' })
  roleCode: string;

  @Column({ name: 'role_sort', type: 'int', default: 0 })
  @ApiProperty({ description: '显示顺序' })
  roleSort: number;

  @Column({
    name: 'data_scope',
    type: 'varchar',
    length: 20,
    default: '1',
    comment: '数据权限范围:1全部,2自定义,3本部门,4本部门及以下,5仅本人',
  })
  @ApiProperty({ description: '数据权限范围:1全部,2自定义,3本部门,4本部门及以下,5仅本人' })
  dataScope: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态:0禁用,1正常' })
  @ApiProperty({ description: '状态:0禁用,1正常' })
  status: number;

  @Column({ name: 'remark', type: 'varchar', length: 500, nullable: true })
  @ApiProperty({ description: '备注', nullable: true })
  remark?: string;

  @ManyToMany(() => User, (user) => user.roles)
  @ApiProperty({ description: '用户列表', type: () => [User] })
  users?: User[];

  @ManyToMany(() => Permission, (perm) => perm.roles)
  @JoinTable({
    name: 'sys_role_permission',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  @ApiProperty({ description: '权限菜单列表', type: () => [Permission] })
  permissions?: Permission[];
}
