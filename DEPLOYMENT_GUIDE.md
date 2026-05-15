# StockFlow 在线部署指南

## 📋 部署方案概览

本系统采用**前后端分离架构**，推荐使用以下免费云服务组合：

### 推荐方案（免费额度）

| 服务 | 用途 | 平台 | 免费额度 |
|------|------|------|----------|
| **业务前端** | Vue3 + Vite | [Vercel](https://vercel.com) | 100GB带宽/月 |
| **管理后台前端** | Vue3 + Vite | Vercel | 共享额度 |
| **业务后端** | NestJS API | [Render](https://render.com) | 750小时/月 |
| **管理后台后端** | NestJS API | Render | 共享额度 |
| **数据库** | PostgreSQL | Render/Supabase | 1GB存储 |
| **缓存** | Redis | Upstash/Railway | 10,000请求/天 |

### 在线访问地址（部署完成后）

```
🌐 业务系统:     https://stockflow-frontend.vercel.app
🔐 管理后台:    https://stockflow-admin-frontend.vercel.app
📡 业务API:     https://stockflow-backend.onrender.com/api
📡 管理API:     https://stockflow-admin-backend.onrender.com/api
```

---

## 🚀 快速部署步骤

### 方式一：一键部署到 Render（推荐新手）

#### 步骤 1：注册账号

1. 访问 https://render.com 注册账号（支持GitHub登录）
2. 访问 https://vercel.com 注册账号（支持GitHub登录）

#### 步骤 2：部署后端服务

1. 登录 Render Dashboard
2. 点击 **"New +" → "Web Service"**
3. 选择 **"Connect GitHub repository"**
4. 选择 `Aaron-yang1874/stockflow` 仓库
5. 配置如下：

**业务后端配置：**
- **Name:** `stockflow-backend`
- **Runtime:** `Docker`
- **Dockerfile Path:** `./backend/Dockerfile`
- **Docker Context:** `./backend`
- **Branch:** `main`

**环境变量：**
```
NODE_ENV=production
PORT=3000
DB_HOST=<你的数据库地址>
DB_PORT=5432
DB_USERNAME=stockflow_user
DB_PASSWORD=<安全密码>
DB_NAME=inventory
REDIS_HOST=<Redis地址>
REDIS_PORT=6379
JWT_SECRET=<生成一个32位以上的随机字符串>
CORS_ORIGIN=https://stockflow-frontend.vercel.app,https://stockflow-admin-frontend.vercel.app
```

6. 点击 **"Create Web Service"**

7. 重复以上步骤，部署**管理后台后端**：
   - **Name:** `stockflow-admin-backend`
   - **Dockerfile Path:** `./admin-backend/Dockerfile`
   - **Docker Context:** `./admin-backend`
   - **PORT:** `3001`
   - **DB_NAME:** `admin_db`

#### 步骤 3：部署数据库

在 Render 中创建 PostgreSQL 数据库：

1. **"New +" → "PostgreSQL"**
2. **Name:** `stockflow-db`
3. **Plan:** Free (1GB)
4. **Region:** 选择离你最近的区域
5. 创建后，记录连接信息

#### 步骤 4：部署 Redis 缓存

选择以下任一免费方案：

**方案A - Upstash (推荐):**
1. 访问 https://upstash.com 注册
2. 创建 Redis 数据库
3. 复制 REST URL 和 Token

**方案B - Railway:**
1. 访问 https://railway.app 注册
2. 添加 Redis 服务
3. 获取连接信息

#### 步骤 5：部署前端到 Vercel

1. 登录 Vercel Dashboard
2. 点击 **"Add New Project"**
3. 导入 GitHub 仓库 `Aaron-yang1874/stockflow`
4. 配置：

**业务前端：**
- **Framework Preset:** Vite
- **Root Directory:** `./frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  ```
  VITE_API_BASE_URL=https://stockflow-backend.onrender.com/api
  ```

5. 点击 **"Deploy"**

6. 重复步骤，部署**管理后台前端**：
   - **Root Directory:** `./admin-frontend`
   - **Environment Variables:**
     ```
     VITE_ADMIN_API_BASE_URL=https://stockflow-admin-backend.onrender.com/api
     ```

---

### 方式二：使用 Docker Compose 本地测试

如果想在本地先测试完整系统：

```bash
# 克隆项目
git clone https://github.com/Aaron-yang1874/stockflow.git
cd stockflow

# 启动所有服务
docker-compose up -d --build

# 等待所有服务启动完成（约2-3分钟）
# 查看日志
docker-compose logs -f

# 访问地址：
# 业务系统: http://localhost
# 管理后台: http://localhost:81
# 业务API: http://localhost:3000
# 管理API: http://localhost:3001
```

---

### 方式三：使用 GitHub Actions 自动化部署

项目已配置好 `.github/workflows/deploy.yml`，实现：

✅ 自动构建Docker镜像  
✅ 推送到GitHub Container Registry  
✅ 触发Render自动部署  
✅ PR预览环境  

**启用方法：**

1. 进入 GitHub 仓库 Settings → Secrets and variables → Actions
2. 添加以下 Secrets：
   - `RENDER_DEPLOY_HOOK_URL`: 从 Render 的 Webhook 设置中获取
3. 后续每次推送到 main 分支会自动部署

---

## 🔐 测试账号

### 业务系统登录

| 角色 | 用户名 | 密码 | 权限 |
|------|--------|------|------|
| 管理员 | admin@stockflow.com | Admin123456 | 全部权限 |
| 操作员 | operator@stockflow.com | Operator123456 | 库存操作 |
| 查看者 | viewer@stockflow.com | Viewer123456 | 只读 |

### 管理后台登录

| 角色 | 用户名 | 密码 | 权限 |
|------|--------|------|------|
| 超级管理员 | superadmin | SuperAdmin123 | 全部权限 |
| 系统管理员 | sysadmin | SysAdmin123 | 系统配置 |

> ⚠️ **首次部署后需要通过API或数据库脚本初始化测试账号**

---

## 🛠️ 初始化数据库脚本

首次部署后，需要执行初始化SQL来创建表结构和测试数据：

```sql
-- 连接到 PostgreSQL 执行以下 SQL

-- 1. 创建业务数据库
CREATE DATABASE inventory;
CREATE DATABASE admin_db;

-- 2. 切换到业务数据库
\c inventory;

-- 3. 创建用户表 (示例)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'operator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 插入测试用户
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@stockflow.com', '$2b$10$hashedpassword', 'admin'),
('operator', 'operator@stockflow.com', '$2b$10$hashedpassword', 'operator'),
('viewer', 'viewer@stockflow.com', '$2b$10$hashedpassword', 'viewer');

-- 更多表结构请参考 backend/src 中的 entity 文件
```

---

## ✅ 部署检查清单

部署完成后，请逐项检查：

- [ ] 业务前端可以访问（https://stockflow-xxx.vercel.app）
- [ ] 管理后台可以访问（https://stockflow-admin-xxx.vercel.app）
- [ ] 业务API健康检查正常（/api/health）
- [ ] 管理API健康检查正常（/api/health）
- [ ] 可以使用测试账号登录
- [ ] 基础CRUD功能正常（产品、库存等）
- [ ] CORS配置正确（无跨域错误）
- [ ] HTTPS证书已生效（绿色锁图标）

---

## 🐛 常见问题排查

### 问题：前端无法连接后端API

**症状：** 浏览器控制台显示 CORS 错误或网络错误

**解决方案：**
1. 检查后端环境变量 `CORS_ORIGIN` 是否包含前端域名
2. 确认后端服务已启动且端口正确
3. 检查防火墙规则是否允许外部访问

### 问题：数据库连接失败

**症状：** 后端日志显示 "ECONNREFUSED"

**解决方案：**
1. 检查数据库地址、端口、用户名密码是否正确
2. 确认数据库服务允许来自后端IP的连接
3. 检查数据库是否已创建对应的数据库和表

### 问题：Redis连接超时

**症状：** 缓存相关功能异常

**解决方案：**
1. 确认Redis服务正在运行
2. 检查Redis连接地址和端口
3. 如果使用Upstash，确认Token有效

### 问题：Vercel部署失败

**症状：** 构建错误或运行时错误

**解决方案：**
1. 检查 `vite.config.ts` 中的代理配置是否已移除
2. 确认所有环境变量已正确设置
3. 查看 Vercel 构建日志获取详细错误信息

---

## 📞 技术支持

如遇到问题，可以通过以下方式获取帮助：

- **GitHub Issues:** https://github.com/Aaron-yang1874/stockflow/issues
- **文档查看:** 项目根目录 README.md
- **审计报告:** AUDIT_REPORT.md
- **安全报告:** SECURITY_AND_QUALITY_REPORT.md

---

## 🎉 部署成功！

恭喜！您的 StockFlow 库存管理系统现已上线！🚀

现在您可以：
- ✅ 通过浏览器访问在线系统
- ✅ 分享链接给团队成员测试
- ✅ 开始正式使用库存管理功能
- ✅ 根据实际需求进行定制开发

祝您使用愉快！💪