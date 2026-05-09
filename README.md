# StockFlow - 企业级库存管理系统

A modern, full-stack inventory management system with a separate admin backend.

## 项目结构

```
stockflow/
├── backend/          # 业务后端 (NestJS + PostgreSQL + Redis)
├── frontend/         # 业务前端 (Vue 3 + Vite + Element Plus)
├── admin-backend/    # 管理后台后端
├── admin-frontend/   # 管理后台前端
└── docker-compose.yml
```

## 快速启动

### 开发模式

```bash
# 业务后端
cd backend && npm install && npm run start:dev

# 管理后端
cd admin-backend && npm install && npm run start:dev

# 业务前端
cd frontend && npm install && npm run dev

# 管理前端
cd admin-frontend && npm install && npm run dev
```

### Docker 模式

```bash
docker-compose up -d --build
```

## 技术栈

### 后端
- NestJS 10
- PostgreSQL 15
- Redis 7
- TypeORM
- JWT Authentication

### 前端
- Vue 3.5
- Vite
- Element Plus
- ECharts

## 安全提醒

生产环境请：
1. 修改所有默认密码
2. 配置环境变量而非硬编码
3. 配置合适的 CORS 域名白名单
4. 定期更新依赖安全版本
