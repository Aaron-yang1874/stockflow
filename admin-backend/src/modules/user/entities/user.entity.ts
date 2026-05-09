import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Dept } from '../../dept/entities/dept.entity';
import { Role } from '../../role/entities/role.entity';

@Entity('sys_user')
export class User extends BaseEntity {
  @Column({ name: 'username', type: 'varchar', length: 30, unique: true })
  @ApiProperty({ description: '用户名' })
  username: string;

  @Column({ name: 'password', type: 'varchar', length: 255, select: false })
  @ApiProperty({ description: '密码' })
  password: string;

  @Column({ name: 'nick_name', type: 'varchar', length: 30, nullable: true })
  @ApiProperty({ description: '昵称', nullable: true })
  nickName?: string;

  @Column({ name: 'real_name', type: 'varchar', length: 30, nullable: true })
  @ApiProperty({ description: '真实姓名', nullable: true })
  realName?: string;

  @Column({ name: 'avatar', type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: '头像', nullable: true })
  avatar?: string;

  @Column({ name: 'gender', type: 'tinyint', default: 0, comment: '性别:0未知,1男,2女' })
  @ApiProperty({ description: '性别:0未知,1男,2女' })
  gender: number;

  @Column({ name: 'phone', type: 'varchar', length: 11, nullable: true })
  @ApiProperty({ description: '手机号', nullable: true })
  phone?: string;

  @Column({ name: 'email', type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: '邮箱', nullable: true })
  email?: string;

  @Column({ name: 'dept_id', type: 'uuid', nullable: true })
  @ApiProperty({ description: '部门ID', nullable: true })
  deptId?: string;

  @ManyToOne(() => Dept, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'dept_id' })
  @ApiProperty({ description: '所属部门', type: () => Dept })
  dept?: Dept;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'sys_user_role',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  @ApiProperty({ description: '角色列表', type: () => [Role] })
  roles?: Role[];

  @Column({ type: 'tinyint', default: 1, comment: '状态:0禁用,1正常' })
  @ApiProperty({ description: '状态:0禁用,1正常' })
  status: number;

  @Column({ name: 'last_login_time', type: 'timestamp', nullable: true })
  @ApiProperty({ description: '最后登录时间', nullable: true })
  lastLoginTime?: Date;

  @Column({ name: 'last_login_ip', type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: '最后登录IP', nullable: true })
  lastLoginIp?: string;
}
