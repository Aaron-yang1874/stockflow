# 📋 库存管理系统上线自检审计报告

---

## 1. 整体风险总览

| 风险等级 | 数量 |
|---------|------|
| 🔴 高风险 | 13 |
| 🟡 中风险 | 7 |
| 🟢 低风险 | 4 |

**结论：⚠️ 需整改后上线**，存在13个高风险问题，其中安全问题占8个，架构问题占5个，均为库存系统上线红线问题。

---

## 2. 详细问题清单

| 模块 | 问题位置 | 风险等级 | 影响范围 | 问题描述 | 大厂标准要求 |
|------|---------|---------|---------|---------|------------|
| 后端安全 | backend/src/main.ts:16 | 🔴 高 | 业务后端 | CORS配置使用通配符`*` | 生产环境CORS必须配置明确白名单，禁止`*` |
| 后端安全 | admin-backend/src/main.ts:16 | 🔴 高 | 管理后端 | CORS配置使用通配符`*` | 生产环境CORS必须配置明确白名单，禁止`*` |
| 容器安全 | docker-compose.yml:14,26 | 🔴 高 | 数据库/缓存 | Postgres、Redis端口直接暴露到宿主机外网 | 数据库、Redis禁止外网端口暴露，仅容器间网络访问 |
| 数据库安全 | docker-compose.yml:9,79 | 🔴 高 | 业务/管理后端 | 使用超级账号`admin`/`postgres`连接DB | 使用普通权限账号，最小权限原则 |
| 敏感信息 | docker-compose.yml:10,45,80 | 🔴 高 | 所有服务 | 数据库密码明文硬编码在docker-compose.yml | 生产环境使用环境变量或密钥管理服务 |
| 敏感信息 | admin-backend/.env:10 | 🔴 高 | 管理后端 | JWT密钥明文硬编码在.env | 生产环境使用安全随机密钥，密钥轮换机制 |
| 容器安全 | backend/Dockerfile | 🔴 高 | 业务后端 | 容器以root用户运行，未指定非root用户 | 必须使用非root用户运行容器 |
| 容器安全 | admin-backend/Dockerfile | 🔴 高 | 管理后端 | 容器以root用户运行，未指定非root用户 | 必须使用非root用户运行容器 |
| 接口安全 | 所有业务Controller | 🔴 高 | 业务后端 | **所有接口无JWT鉴权**，仅加了`@ApiBearerAuth()`装饰器但无Guard | 所有接口必须经过JWT Guard验证 |
| 全局异常 | 所有服务 | 🔴 高 | 业务/管理后端 | 无全局异常过滤器，生产环境可能泄露堆栈信息 | 全局异常过滤器，生产环境只返回code和message |
| 接口幂等 | backend/src/stock-in/stock-in.service.ts | 🔴 高 | 库存入库 | 入库接口无幂等性保护，重复提交会产生重复库存 | 库存操作必须有幂等性设计（订单号唯一约束） |
| 接口幂等 | backend/src/stock-out/stock-out.service.ts | 🔴 高 | 库存出库 | 出库接口无幂等性保护，重复提交会产生重复扣减 | 库存操作必须有幂等性设计（订单号唯一约束） |
| 缓存隔离 | backend/src/app.module.ts:60-63<br>admin-backend/src/app.module.ts:? | 🔴 高 | 业务/管理后端 | Redis未配置DB号隔离，默认使用DB0 | 业务系统与管理系统必须使用不同Redis DB |
| TypeORM配置 | backend/src/app.module.ts:53 | 🟡 中 | 业务后端 | `synchronize: true`生产环境开启，存在数据风险 | 生产环境关闭`synchronize`，使用Migration |
| Swagger安全 | backend/src/main.ts:51-53<br>admin-backend/src/main.ts:51-53 | 🟡 中 | 业务/管理后端 | Swagger生产环境只是隐藏，并未加鉴权保护 | 生产环境Swagger必须鉴权才能访问 |
| 事务安全 | backend/src/stock-in/stock-in.service.ts:64-67<br>backend/src/stock-out/stock-out.service.ts:71-74 | 🟡 中 | 库存模块 | 使用SQL字符串拼接操作库存，可能存在SQL注入风险 | 使用TypeORM的QueryBuilder或参数化查询 |
| 审计日志 | 所有模块 | 🟡 中 | 所有服务 | 无关键操作审计日志，无法追溯库存变动操作人 | 所有关键操作（入库、出库、删单）必须记录审计日志 |
| 依赖安全 | 所有package.json | 🟡 中 | 所有服务 | 无依赖扫描配置、无锁定版本安全检查 | 配置npm audit或Snyk定期扫描，锁定版本 |
| 监控告警 | 所有模块 | 🟡 中 | 所有服务 | 无任何健康检查和监控告警配置 | 配置Prometheus、ELK监控，关键指标告警 |
| 日志管理 | 所有模块 | 🟡 中 | 所有服务 | 日志无统一规范，无ELK/S3存储，无法查询历史 | 日志统一输出JSON格式，持久化存储 |
| 前端安全 | frontend/ | 🟢 低 | 业务前端 | 未检查XSS防护、CSP策略 | 前端配置CSP策略，输入输出转义 |
| 备份恢复 | docker-compose.yml | 🟢 低 | 数据库 | 无PostgreSQL备份策略配置 | 配置定期备份（日/周/月），备份异地存储 |
| 灰度上线 | 所有模块 | 🟢 低 | 部署 | 无灰度发布和回滚方案 | 配置灰度发布策略，有完整回滚方案 |
| 性能优化 | 数据库 | 🟢 低 | 所有模块 | 未检查数据库索引和慢查询 | 建立关键查询索引，配置慢查询日志 |

---

## 3. 一键整改方案

### 🔴 高优先级整改方案（必须执行）

#### 1. 修复CORS配置，禁止通配符
**文件：** `backend/src/main.ts`、`admin-backend/src/main.ts`

```typescript
// backend/src/main.ts 和 admin-backend/src/main.ts
app.enableCors({
  origin: (origin, callback) => {
    const whitelist = process.env.CORS_ORIGIN ? 
      process.env.CORS_ORIGIN.split(',') : 
      (process.env.NODE_ENV === 'production' ? [] : ['http://localhost:5173', 'http://localhost:8080']);
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
});
```

#### 2. 修复容器安全 - 非root用户运行、关闭端口暴露
**文件：** `docker-compose.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: stockflow-db
    user: postgres  # 指定用户
    environment:
      POSTGRES_DB: inventory
      POSTGRES_USER: stockflow_app
      POSTGRES_PASSWORD: ${DB_PASSWORD:-Stockflow@2026!Secure}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    # ports:  # 注释掉，禁止外网访问
    #  - "5432:5432"
    networks:
      - internal
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U stockflow_app -d inventory"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: stockflow-redis
    user: redis  # 指定用户
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD:-Redis@2026!Secure}
    volumes:
      - redis_data:/data
    # ports:  # 注释掉，禁止外网访问
    #  - "6379:6379"
    networks:
      - internal
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD:-Redis@2026!Secure}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: stockflow-backend
    user: node  # 指定非root用户
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: stockflow_app
      DB_PASSWORD: ${DB_PASSWORD:-Stockflow@2026!Secure}
      DB_NAME: inventory
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD:-Redis@2026!Secure}
      REDIS_DB: 0
      PORT: 3000
      NODE_ENV: production
      CORS_ORIGIN: https://stockflow.yourdomain.com
      JWT_SECRET: ${JWT_SECRET:-$(openssl rand -hex 32)}
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - internal
      - public
    restart: unless-stopped

  admin-backend:
    build:
      context: ./admin-backend
      dockerfile: Dockerfile
    container_name: admin-backend
    user: node  # 指定非root用户
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: stockflow_admin
      DB_PASSWORD: ${ADMIN_DB_PASSWORD:-StockflowAdmin@2026!Secure}
      DB_NAME: admin_db
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD:-Redis@2026!Secure}
      REDIS_DB: 1
      PORT: 3001
      NODE_ENV: production
      CORS_ORIGIN: https://admin.yourdomain.com
      JWT_SECRET: ${ADMIN_JWT_SECRET:-$(openssl rand -hex 32)}
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - internal
      - public
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: stockflow-frontend
    user: nginx  # 指定用户
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - public
    restart: unless-stopped

  admin-frontend:
    build:
      context: ./admin-frontend
      dockerfile: Dockerfile
    container_name: admin-frontend
    user: nginx  # 指定用户
    ports:
      - "81:80"
    depends_on:
      - admin-backend
    networks:
      - public
    restart: unless-stopped

networks:
  internal:
    internal: true
  public:

volumes:
  postgres_data:
  redis_data:
```

#### 3. 修复Dockerfile - 添加非root用户
**文件：** `backend/Dockerfile`

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN mkdir -p /app/logs && chown -R node:node /app  # 创建logs目录并授权
USER node  # 切换到非root用户
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/package.json ./
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

**文件：** `admin-backend/Dockerfile`

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN mkdir -p /app/logs && chown -R node:node /app
USER node
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/package.json ./
EXPOSE 3001
CMD ["node", "dist/main.js"]
```

#### 4. 添加业务后端JWT鉴权和全局异常
**文件：** `backend/src/auth/auth.module.ts` (新建)
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET', 'default-secret-change-this'),
        signOptions: { expiresIn: '2h' },
      }),
    }),
  ],
  exports: [JwtModule],
})
export class AuthModule {}
```

**文件：** `backend/src/auth/jwt-auth.guard.ts` (新建)
```typescript
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private config: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) throw new UnauthorizedException('未登录');
    
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get('JWT_SECRET'),
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('登录过期');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

**文件：** `backend/src/common/filters/http-exception.filter.ts` (新建)
```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorBody =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? exceptionResponse
        : { message: exceptionResponse };

    response.status(status).json({
      code: status,
      message: (errorBody as any).message || '请求失败',
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(process.env.NODE_ENV !== 'production' ? { stack: exception.stack } : {}),
    });
  }
}
```

**文件：** `backend/src/main.ts` - 更新，添加鉴权和异常过滤器
```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  const corsWhitelist = process.env.CORS_ORIGIN ? 
    process.env.CORS_ORIGIN.split(',') : 
    (process.env.NODE_ENV === 'production' ? [] : ['http://localhost:5173', 'http://localhost:8080']);
  
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || corsWhitelist.includes(origin)) callback(null, true);
      else callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: '请求过于频繁，请稍后再试',
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(app.get('JwtService'), app.get(ConfigService)));

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('库存管理系统 API')
      .setDescription('小型制造企业库存管理系统接口文档')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application running on http://localhost:${port}`);
}
bootstrap();
```

#### 5. 添加库存操作幂等性 - 订单号唯一约束
**文件：** `backend/src/stock-in/entities/stock-in.entity.ts` (添加唯一索引)
```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';

@Entity('stock_in')
export class StockIn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })  // 添加唯一约束，确保幂等
  @Column({ type: 'varchar', length: 32 })
  orderNo: string;
  
  // ...其他字段不变
}
```

**文件：** `backend/src/stock-out/entities/stock-out.entity.ts` (添加唯一索引)
```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';

@Entity('stock_out')
export class StockOut {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })  // 添加唯一约束，确保幂等
  @Column({ type: 'varchar', length: 32 })
  orderNo: string;
  
  // ...其他字段不变
}
```

**文件：** `backend/src/stock-in/stock-in.service.ts` - 添加幂等检查
```typescript
async create(dto: CreateStockInDto, operatedBy: string): Promise<StockIn> {
  // 幂等检查
  const existingOrder = await this.stockInRepo.findOne({ where: { orderNo: dto.orderNo || '' } });
  if (existingOrder) {
    return this.findOne(existingOrder.id);
  }
  
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const totalAmount = dto.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    const stockIn = new StockIn();
    stockIn.id = uuidv4();
    stockIn.orderNo = dto.orderNo || this.generateOrderNo(dto.type);
    stockIn.type = dto.type;
    stockIn.supplierId = dto.supplierId || null;
    stockIn.warehouseId = dto.warehouseId;
    stockIn.totalAmount = totalAmount;
    stockIn.status = 'pending';
    stockIn.remark = dto.remark || null;
    stockIn.operatedBy = operatedBy;

    const savedStockIn = await queryRunner.manager.save(stockIn);

    // ...其他代码不变
  } catch (error) {
    // ...不变
  }
}
```

#### 6. 修复TypeORM配置 - 关闭synchronize
**文件：** `backend/src/app.module.ts`
```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: config.get('DB_HOST'),
    port: config.get<number>('DB_PORT'),
    username: config.get('DB_USERNAME'),
    password: config.get('DB_PASSWORD'),
    database: config.get('DB_NAME'),
    entities: [/* ...原有entities...*/],
    synchronize: process.env.NODE_ENV !== 'production',  // 生产环境关闭
    migrations: ['dist/migrations/*.js'],
    migrationsRun: true,
    logging: config.get('NODE_ENV') === 'development',
  }),
})
```

#### 7. 配置Redis DB隔离
**文件：** `backend/src/app.module.ts` - 更新Redis连接
```typescript
RedisModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'single',
    url: `redis://:${config.get('REDIS_PASSWORD', '')}@${config.get('REDIS_HOST')}:${config.get('REDIS_PORT')}/${config.get('REDIS_DB', 0)}`,
  }),
})
```

**文件：** `admin-backend/src/app.module.ts` - 同样配置，使用DB 1
```typescript
RedisModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'single',
    url: `redis://:${config.get('REDIS_PASSWORD', '')}@${config.get('REDIS_HOST')}:${config.get('REDIS_PORT')}/${config.get('REDIS_DB', 1)}`,
  }),
})
```

#### 8. 修复库存SQL注入风险 - 使用QueryBuilder
**文件：** `backend/src/stock-in/stock-in.service.ts`
```typescript
// 替换原第64-67行
if (inventory) {
  await queryRunner.manager
    .createQueryBuilder()
    .update(Inventory)
    .set({ quantity: () => 'quantity + :qty' })
    .where('productId = :pid AND warehouseId = :wid', { pid: item.productId, wid: dto.warehouseId })
    .setParameter('qty', item.quantity)
    .execute();
}
```

**文件：** `backend/src/stock-out/stock-out.service.ts`
```typescript
// 替换原第71-74行
await queryRunner.manager
  .createQueryBuilder()
  .update(Inventory)
  .set({ quantity: () => 'quantity - :qty' })
  .where('productId = :pid AND warehouseId = :wid', { pid: item.productId, wid: dto.warehouseId })
  .setParameter('qty', item.quantity)
  .execute();
```

---

### 🟡 中优先级整改方案

#### 9. 添加审计日志装饰器
**文件：** `backend/src/common/decorators/audit-log.decorator.ts`
```typescript
import { SetMetadata } from '@nestjs/common';

export const AUDIT_LOG_KEY = 'audit_log';
export const AuditLog = (action: string, module: string) => 
  SetMetadata(AUDIT_LOG_KEY, { action, module });
```

#### 10. 生产环境变量配置 - .env.production
```dotenv
# .env.production
NODE_ENV=production
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=stockflow_app
DB_PASSWORD=Stockflow@2026!Secure
DB_NAME=inventory
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=Redis@2026!Secure
REDIS_DB=0
CORS_ORIGIN=https://stockflow.yourdomain.com
JWT_SECRET=change-this-strong-32byte-key-use-kms
JWT_EXPIRES_IN=2h
```

---

### 🟢 低优先级整改方案

#### 11. 添加数据库备份脚本
**文件：** `scripts/backup-db.sh`
```bash
#!/bin/bash
BACKUP_DIR=/backups
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
docker exec stockflow-db pg_dump -U stockflow_app -d inventory | gzip > $BACKUP_DIR/inventory_$DATE.sql.gz
find $BACKUP_DIR -name "inventory_*.sql.gz" -mtime +7 -delete
```

#### 12. 创建回滚方案 - ROLLBACK_GUIDE.md
```markdown
# 库存管理系统回滚指南

## 快速回滚
```bash
# 使用git回滚到上一个稳定版本
git revert HEAD
docker-compose down
docker-compose up -d --build
```

## 数据库回滚
```bash
# 从最新备份恢复
gunzip -c /backups/inventory_latest.sql.gz | docker exec -i stockflow-db psql -U stockflow_app -d inventory
```
```

---

## 4. 最终上线结论

⚠️ **必须整改后上线**

当前系统存在以下红线问题，未修复前禁止上线：
1. ❌ 业务后端所有接口无JWT鉴权
2. ❌ 数据库、Redis端口暴露到外网
3. ❌ CORS使用通配符，生产环境有跨站安全风险
4. ❌ 容器以root运行，存在逃逸风险
5. ❌ 库存操作无幂等性保护，重复提交会产生脏数据
6. ❌ 无全局异常过滤，生产环境可能泄露敏感信息

---

## 5. 上线后运维&监控建议

### 监控告警建议
1. **健康检查：** 配置Liveness/Readiness探针
2. **指标监控：** 集成Prometheus + Grafana，监控：
   - API请求量/延迟/错误率
   - 数据库连接池
   - 库存变动频率
3. **日志收集：** 配置ELK/PLG栈，统一JSON日志
4. **告警规则：**
   - 错误率 > 5% 触发警告
   - 订单处理失败触发警告
   - 库存不足触发警告

### 运维规范
1. **定期备份：** 每日凌晨3点自动备份，保留7天
2. **安全扫描：** 每周运行npm audit和Docker扫描
3. **密钥轮换：** JWT密钥每90天轮换一次
4. **灰度发布：** 使用Nginx权重，先10%流量验证
5. **灾难恢复：** 每月执行一次灾难恢复演练
