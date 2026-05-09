import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    // 用户名长度验证
    if (!username || username.length < 3 || username.length > 50) {
      throw new UnauthorizedException('用户名无效');
    }

    const user = await this.userRepo.findOne({
      where: { username },
      select: ['id', 'username', 'password', 'status'],
      relations: ['roles'],
    });

    if (!user) throw new UnauthorizedException('用户不存在');
    if (user.status === 0) throw new UnauthorizedException('账号已禁用');

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) throw new UnauthorizedException('密码错误');

    return user;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }

  async register(data: Partial<User>) {
    // 生产环境禁止公开注册
    if (process.env.NODE_ENV === 'production') {
      throw new BadRequestException('注册功能暂不可用');
    }

    // 验证密码强度
    if (!data.password || data.password.length < 6) {
      throw new BadRequestException('密码长度至少为6位');
    }

    // 检查用户名是否已存在
    const existingUser = await this.userRepo.findOne({
      where: { username: data.username },
    });
    if (existingUser) {
      throw new BadRequestException('用户名已存在');
    }

    const salt = await bcrypt.genSalt(12);
    data.password = await bcrypt.hash(data.password, salt);
    const user = this.userRepo.create(data);
    return await this.userRepo.save(user);
  }
}
