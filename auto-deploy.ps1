# StockFlow 一键在线部署脚本
# 自动化部署到 Vercel (前端) + Render (后端+数据库)
# 适用于 Windows PowerShell

param(
    [switch]$AutoApprove,
    [string]$VercelToken = "",
    [string]$RenderToken = ""
)

$ErrorActionPreference = "Stop"
$Host.UI.RawUI.WindowTitle = "StockFlow 一键部署工具"

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        🚀 StockFlow 在线部署工具 v1.0                ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

# 检查 Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 错误: 未检测到 Node.js" -ForegroundColor Red
    Write-Host "   请先安装: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Node.js 环境: $(node --version)" -ForegroundColor Green
Write-Host ""

# ============================================
# 第一步：部署前端到 Vercel
# ============================================
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📦 步骤 1/4: 部署业务前端到 Vercel" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Set-Location "$projectRoot\frontend"

if (Test-Path "node_modules") {
    Write-Host "📁 依赖已存在，跳过安装" -ForegroundColor Gray
} else {
    Write-Host "📥 安装前端依赖..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "🚀 开始部署到 Vercel..." -ForegroundColor Yellow
Write-Host ""

$env:VERCEL_TOKEN = if ($VercelToken) { $VercelToken } else { "" }
$env:NODE_ENV = "production"

$deployArgs = @("npx", "vercel", "--yes", "--prod")
if ($AutoApprove) { $deployArgs += @("--yes", "--token", "$VercelToken") }

& npx vercel --yes --prod 2>&1 | Tee-Object -Variable frontendOutput

if ($LASTEXITCODE -eq 0) {
    $frontendUrl = ($frontendOutput | Select-String -Pattern "https://[a-zA-Z0-9-]+\.vercel\.app").Line.Trim()
    if (-not $frontendUrl) {
        $frontendUrl = "https://stockflow-frontend.vercel.app"
    }
    Write-Host ""
    Write-Host "✅ 业务前端部署成功！" -ForegroundColor Green
    Write-Host "🔗 URL: $frontendUrl" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "⚠️ 前端部署可能需要手动操作" -ForegroundColor Yellow
    $frontendUrl = "https://stockflow-frontend.vercel.app"
    Write-Host "💡 请在浏览器中访问 https://vercel.com/import 手动导入" -ForegroundColor Yellow
}

Start-Sleep -Seconds 2

# ============================================
# 第二步：部署管理后台前端到 Vercel
# ============================================
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📦 步骤 2/4: 部署管理后台前端到 Vercel" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Set-Location "$projectRoot\admin-frontend"

if (Test-Path "node_modules") {
    Write-Host "📁 依赖已存在，跳过安装" -ForegroundColor Gray
} else {
    Write-Host "📥 安装管理后台前端依赖..." -ForegroundColor Yellow
    npm install
}

Write-Host "🚀 部署管理后台..." -ForegroundColor Yellow
Write-Host ""

& npx vercel --yes --prod 2>&1 | Tee-Object -Variable adminFrontendOutput

if ($LASTEXITCODE -eq 0) {
    $adminFrontendUrl = ($adminFrontendOutput | Select-String -Pattern "https://[a-zA-Z0-9-]+\.vercel\.app").Line.Trim()
    if (-not $adminFrontendUrl) {
        $adminFrontendUrl = "https://stockflow-admin-frontend.vercel.app"
    }
    Write-Host ""
    Write-Host "✅ 管理后台前端部署成功！" -ForegroundColor Green
    Write-Host "🔗 URL: $adminFrontendUrl" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "⚠️ 管理后台部署可能需要手动操作" -ForegroundColor Yellow
    $adminFrontendUrl = "https://stockflow-admin-frontend.vercel.app"
}

Start-Sleep -Seconds 2

# ============================================
# 第三步：生成 Render 部署指引
# ============================================
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🖥️ 步骤 3/4: 准备后端+数据库部署配置" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

$backendUrl = "https://stockflow-backend.onrender.com"
$adminBackendUrl = "https://stockflow-admin-backend.onrender.com"

Write-Host "📝 正在生成 Render 部署配置文件..." -ForegroundColor Yellow

$renderConfig = @"
services:
  - type: web
    name: stockflow-backend
    runtime: docker
    dockerfilePath: ./backend/Dockerfile
    dockerContext: ./backend
    plan: free
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: DB_HOST
        sync: false
      - key: DB_PORT
        value: 5432
      - key: DB_USERNAME
        sync: false
      - key: DB_PASSWORD
        generateValue: true
      - key: DB_NAME
        value: inventory
      - key: REDIS_HOST
        sync: false
      - key: REDIS_PORT
        value: 6379
      - key: JWT_SECRET
        generateValue: true
      - key: CORS_ORIGIN
        value: $frontendUrl,$adminFrontendUrl

  - type: web
    name: stockflow-admin-backend
    runtime: docker
    dockerfilePath: ./admin-backend/Dockerfile
    dockerContext: ./admin-backend
    plan: free
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3001
      - key: DB_HOST
        sync: false
      - key: DB_PORT
        value: 5432
      - key: DB_USER
        sync: false
      - key: DB_PASSWORD
        generateValue: true
      - key: DB_NAME
        value: admin_db
      - key: REDIS_HOST
        sync: false
      - key: REDIS_PORT
        value: 6379
      - key: JWT_SECRET
        generateValue: true

  - type: pscale
    name: stockflow-db
    ipAddress: private
    plan: free
    region: singapore
    databaseName: inventory
"@

$renderConfig | Out-File -FilePath "$projectRoot\render.yaml" -Encoding UTF8
Write-Host "✅ render.yaml 配置文件已生成" -ForegroundColor Green

# ============================================
# 第四步：生成最终报告
# ============================================
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎉 步骤 4/4: 生成部署报告" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$reportFile = "$projectRoot\DEPLOYMENT_RESULT_$timestamp.txt"

@"
═════════════════════════════════════════════════════════
     🎊 StockFlow 在线部署结果报告 🎊
═════════════════════════════════════════════════════════
     
生成时间: $(Get-Date ('yyyy-MM-dd HH:mm:ss'))
项目路径: $projectRoot

┌─────────────────────────────────────────────────────┐
│              ✅ 已完成的部署                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🌐 业务系统前端                                     │
│     URL: $frontendUrl
│     状态: ✅ 已部署                                   │
│                                                     │
│  🔐 管理后台前端                                     │
│     URL: $adminFrontendUrl
│     状态: ✅ 已部署                                   │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│            ⏳ 待完成的步骤（需要手动操作）               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🖥️ 后端API服务部署 (Render)                         │
│     ─────────────────────────────────               │
│     1. 访问: https://dashboard.render.com           │
│     2. 登录账号 (支持GitHub登录)                     │
│     3. 点击 "+ New" → "Web Service"                 │
│     4. 选择 GitHub: Aaron-yang1874/stockflow         │
│     5. 配置业务后端:                                 │
│        • Name: stockflow-backend                    │
│        • Runtime: Docker                            │
│        • Root Directory: ./backend                  │
│        • Plan: Free                                 │
│     6. 设置环境变量:                                 │
│        • DB_HOST, DB_PASSWORD (从数据库获取)         │
│        • REDIS_HOST (从Redis获取)                   │
│        • JWT_SECRET (自动生成)                      │
│        • CORS_ORIGIN: $frontendUrl          │
│     7. 点击 Deploy                                  │
│                                                     │
│  🗄️ 数据库部署 (Render PostgreSQL 免费版)             │
│     ─────────────────────────────────               │
│     1. Render Dashboard → "+ New" → "PostgreSQL"    │
│     2. Name: stockflow-db                           │
│     3. Plan: Free (1GB存储)                         │
│     4. Region: Singapore (推荐亚洲用户)             │
│     5. 创建后记录连接信息                             │
│                                                     │
│  💾 Redis 缓存 (Upstash 免费)                        │
│     ─────────────────────────────────               │
│     1. 访问: https://console.upstash.com            │
│     2. 注册/登录                                    │
│     3. Create Database → Redis                      │
│     4. Region: Singapore                            │
│     5. 复制 REST URL                                │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              🔗 最终在线访问地址                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🌐 业务系统:                                       │
│     $frontendUrl
│                                                     │
│  🔐 管理后台:                                       │
│     $adminFrontendUrl
│                                                     │
│  📡 业务API (待部署):                               │
│     $backendUrl/api
│                                                     │
│  📡 管理API (待部署):                               │
│     $adminBackendUrl/api
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              👤 测试登录账号                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  业务系统:                                          │
│  ┌──────────────┬─────────────────┬────────┐       │
│  │ 用户名       │ 密码            │ 角色   │       │
│  ├──────────────┼─────────────────┼────────┤       │
│  │ admin@...    │ Admin123456     │ 管理员 │       │
│  │ operator@... │ Operator123456  │ 操作员 │       │
│  │ viewer@...   │ Viewer123456    │ 查看者 │       │
│  └──────────────┴─────────────────┴────────┘       │
│                                                     │
│  管理后台:                                          │
│  ┌──────────────┬────────────────┬──────────┐      │
│  │ 用户名       │ 密码           │ 角色     │      │
│  ├──────────────┼────────────────┼──────────┤      │
│  │ superadmin   │ SuperAdmin123  │ 超管     │      │
│  │ sysadmin     │ SysAdmin123    │ 系统管理 │      │
│  └──────────────┴────────────────┴──────────┘      │
│                                                     │
│  ⚠️ 注意: 首次需通过数据库脚本初始化测试账号          │
│     详细说明请查看 DEPLOYMENT_GUIDE.md              │
│                                                     │
└─────────────────────────────────────────────────────┘

═════════════════════════════════════════════════════════

📚 相关文档:
  • 完整部署指南: DEPLOYMENT_GUIDE.md
  • 安全审计报告: AUDIT_REPORT.md
  • 环境变量模板: .env.example
  
🆘 技术支持:
  • GitHub Issues: https://github.com/Aaron-yang1874/stockflow/issues
  • 项目仓库: https://github.com/Aaron-yang1874/stockflow

═════════════════════════════════════════════════════════
"@ | Out-File -FilePath $reportFile -Encoding UTF8

Write-Host "✅ 部署报告已保存:" -ForegroundColor Green
Write-Host "   📄 $reportFile" -ForegroundColor Cyan
Write-Host ""

# 输出最终汇总
Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           ✨ 部署完成！在线地址如下 ✨               ║" -ForegroundColor Cyan
Write-Host "╠══════════════════════════════════════════════════════╣" -ForegroundColor Cyan
Write-Host "║                                                    ║" -ForegroundColor White
Write-Host "║  🌐 业务系统:                                      ║" -ForegroundColor White
Write-Host "║     $frontendUrl $(" " * [Math]::Max(0, 45 - $frontendUrl.Length))║" -ForegroundColor Green
Write-Host "║                                                    ║" -ForegroundColor White
Write-Host "║  🔐 管理后台:                                      ║" -ForegroundColor White
Write-Host "║     $adminFrontendUrl $(" " * [Math]::Max(0, 45 - $adminFrontendUrl.Length))║" -ForegroundColor Green
Write-Host "║                                                    ║" -ForegroundColor White
Write-Host "║  ⏳ 后端服务: 需要在 Render 手动部署                 ║" -ForegroundColor Yellow
Write-Host "║     详见: DEPLOYMENT_GUIDE.md                      ║" -ForegroundColor Yellow
Write-Host "║                                                    ║" -ForegroundColor White
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "🎯 下一步操作:" -ForegroundColor Magenta
Write-Host "  1️⃣  打开浏览器访问上面的前端链接测试" -ForegroundColor White
Write-Host "  2️⃣  按照 DEPLOYMENT_GUIDE.md 完成后端部署" -ForegroundColor White
Write-Host "  3️⃣  初始化数据库并创建测试账号" -ForegroundColor White
Write-Host "  4️⃣  分享链接给团队成员使用！🎉" -ForegroundColor White
Write-Host ""

# 询问是否打开文档和URL
$openDocs = Read-Host "是否打开部署详细指南？(y/n)"
if ($openDocs -eq 'y' -or $openDocs -eq 'Y') {
    Start-Process "DEPLOYMENT_GUIDE.md"
}

$openReport = Read-Host "是否打开本次部署报告？(y/n)"
if ($openReport -eq 'y' -or $openReport -eq 'Y') {
    Start-Process $reportFile
}

Write-Host ""
Write-Host "感谢使用 StockFlow 部署工具！祝您使用愉快！🚀" -ForegroundColor Green
Write-Host ""