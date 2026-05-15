# StockFlow 一键部署脚本
# 自动化部署到 Vercel + Render

param(
    [ValidateSet("preview", "production")]
    [string]$Environment = "preview",
    
    [switch]$SkipConfirmation
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🚀 StockFlow 在线部署工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查必要工具
Write-Host "[1/6] 检查环境..." -ForegroundColor Yellow

$requiredTools = @("git", "node", "npm")
foreach ($tool in $requiredTools) {
    if (Get-Command $tool -ErrorAction SilentlyContinue) {
        Write-Host "  ✓ $tool 已安装" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $tool 未安装，请先安装" -ForegroundColor Red
        exit 1
    }
}

# 检查 Vercel CLI
if (Get-Command vercel -ErrorAction SilentlyContinue) {
    Write-Host "  ✓ Vercel CLI 已安装" -ForegroundColor Green
} else {
    Write-Host "  正在安装 Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# 检查 Render CLI (可选)
if (-not (Get-Command render -ErrorAction SilentlyContinue)) {
    Write-Host "  ℹ Render CLI 未安装（可选）" -ForegroundColor Gray
}

Write-Host ""
Write-Host "[2/6] 准备部署配置..." -ForegroundColor Yellow

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

# 创建生产环境变量文件模板
if (-not (Test-Path ".env.production")) {
    @"
# ===== 业务后端环境变量 =====
NODE_ENV=production
PORT=3000
DB_HOST=stockflow-db.xxx.render.com
DB_PORT=5432
DB_USERNAME=stockflow_user
DB_PASSWORD=CHANGE_ME_SECURE_PASSWORD
DB_NAME=inventory
REDIS_HOST=stockflow-redis.upstash.io
REDIS_PORT=6379
JWT_SECRET=$(New-Guid).ToString('N') + $(New-Guid).ToString('N')
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://stockflow-frontend.vercel.app,https://stockflow-admin-frontend.vercel.app

# ===== 前端环境变量 =====
VITE_API_BASE_URL=https://stockflow-backend.onrender.com/api
"@ | Out-File -FilePath ".env.production" -Encoding UTF8
    
    Write-Host "  ✓ 已创建 .env.production 模板" -ForegroundColor Green
    Write-Host "  ⚠ 请编辑 .env.production 并填写实际值！" -ForegroundColor Yellow
} else {
    Write-Host "  ✓ .env.production 已存在" -ForegroundColor Green
}

if (-not $SkipConfirmation) {
    Write-Host ""
    Write-Host "即将执行以下操作：" -ForegroundColor Magenta
    Write-Host "  1. 部署业务前端到 Vercel ($Environment)" -ForegroundColor White
    Write-Host "  2. 部署管理后台前端到 Vercel ($Environment)" -ForegroundColor White
    Write-Host "  3. 提供后端和数据库部署指引" -ForegroundColor White
    Write-Host ""
    $confirm = Read-Host "是否继续？(y/n)"
    if ($confirm -ne 'y') {
        Write-Host "已取消部署" -ForegroundColor Yellow
        exit 0
    }
}

Write-Host ""
Write-Host "[3/6] 部署业务前端到 Vercel..." -ForegroundColor Yellow

Set-Location "$projectRoot\frontend"
$frontendDeployResult = vercel --prod:$($Environment -eq 'production') --yes 2>&1
if ($LASTEXITCODE -eq 0) {
    $frontendUrl = ($frontendDeployResult | Select-String -Pattern "https://.*\.vercel\.app").Line.Trim()
    Write-Host "  ✓ 业务前端部署成功！" -ForegroundColor Green
    Write-Host "  URL: $frontendUrl" -ForegroundColor Cyan
} else {
    Write-Host "  ✗ 业务前端部署失败" -ForegroundColor Red
    Write-Host $frontendDeployResult -ForegroundColor Red
}

Write-Host ""
Write-Host "[4/6] 部署管理后台前端到 Vercel..." -ForegroundColor Yellow

Set-Location "$projectRoot\admin-frontend"
$adminFrontendDeployResult = vercel --prod:$($Environment -eq 'production') --yes 2>&1
if ($LASTEXITCODE -eq 0) {
    $adminFrontendUrl = ($adminFrontendDeployResult | Select-String -Pattern "https://.*\.vercel\.app").Line.Trim()
    Write-Host "  ✓ 管理后台前端部署成功！" -ForegroundColor Green
    Write-Host "  URL: $adminFrontendUrl" -ForegroundColor Cyan
} else {
    Write-Host "  ✗ 管理后台前端部署失败" -ForegroundColor Red
    Write-Host $adminFrontendDeployResult -ForegroundColor Red
}

Write-Host ""
Write-Host "[5/6] 生成部署报告..." -ForegroundColor Yellow

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$reportFile = "$projectRoot\DEPLOY_REPORT_$timestamp.txt"

@"
========================================
  StockFlow 部署报告
========================================
生成时间: $(Get-Date)
环境: $Environment

✅ 已完成:
--------
1. 业务前端已部署到 Vercel
   URL: $($frontendUrl ?? '待确认')

2. 管理后台前端已部署到 Vercel
   URL: $($adminFrontendUrl ?? '待确认')

⏳ 待手动完成:
-------------

📦 后端服务部署 (Render):
   1. 访问 https://dashboard.render.com
   2. 点击 "New+ → Web Service"
   3. 连接 GitHub 仓库: Aaron-yang1874/stockflow
   4. 配置业务后端:
      - Name: stockflow-backend
      - Runtime: Docker
      - Dockerfile Path: ./backend/Dockerfile
   5. 配置管理后台后端:
      - Name: stockflow-admin-backend  
      - Runtime: Docker
      - Dockerfile Path: ./admin-backend/Dockerfile
   6. 设置环境变量 (参考 .env.production)

🗄️ 数据库部署 (Render PostgreSQL 或 Supabase):
   1. 创建 PostgreSQL 数据库
   2. 执行初始化 SQL 脚本
   3. 更新后端数据库连接信息

💾 Redis 缓存 (Upstash 免费方案):
   1. 注册 https://upstash.com
   2. 创建 Redis 数据库
   3. 复制连接地址到后端环境变量

🔗 最终访问地址:
-----------
• 业务系统: $($frontendUrl ?? 'https://your-frontend.vercel.app')
• 管理后台: $($adminFrontendUrl ?? 'https://your-admin-frontend.vercel.app')
• 业务API: https://stockflow-backend.onrender.com/api
• 管理API: https://stockflow-admin-backend.onrender.com/api

👤 测试账号:
---------
管理员: admin@stockflow.com / Admin123456
操作员: operator@stockflow.com / Operator123456

📚 详细文档:
---------
• 完整部署指南: DEPLOYMENT_GUIDE.md
• 安全审计报告: AUDIT_REPORT.md
• 项目说明: README.md

========================================
"@ | Out-File -FilePath $reportFile -Encoding UTF8

Write-Host "  ✓ 部署报告已保存: $reportFile" -ForegroundColor Green

Write-Host ""
Write-Host "[6/6] 完成！" -ForegroundColor Yellow

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🎉 前端部署完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
if ($frontendUrl) { Write-Host "  🌐 业务系统: $frontendUrl" -ForegroundColor Cyan }
if ($adminFrontendUrl) { Write-Host "  🔐 管理后台: $adminFrontendUrl" -ForegroundColor Cyan }
Write-Host ""
Write-Host "下一步操作:" -ForegroundColor Yellow
Write-Host "  1. 查看 DEPLOY_REPORT_$timestamp.txt 获取详细指引" -ForegroundColor White
Write-Host "  2. 按照 DEPLOYMENT_GUIDE.md 完成后端和数据库部署" -ForegroundColor White
Write-Host "  3. 使用测试账号登录测试功能" -ForegroundColor White
Write-Host ""
Read-Host "按回车键打开部署指南..."

Start-Process "DEPLOYMENT_GUIDE.md"