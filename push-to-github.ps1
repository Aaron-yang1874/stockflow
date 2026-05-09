# StockFlow GitHub 自动推送脚本
# 此脚本将自动完成 Git 初始化、配置和代码推送

param(
    [string]$Token = $env:GH_TOKEN,
    [string]$Username = "Aaron-yang1874",
    [string]$RepoName = "stockflow"
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  StockFlow GitHub 推送工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. 检查并添加 Git 到 PATH
Write-Host "[1/6] 检查 Git 安装..." -ForegroundColor Yellow

$gitPaths = @(
    "C:\Program Files\Git\cmd",
    "C:\Program Files (x86)\Git\cmd",
    "$env:LOCALAPPDATA\Programs\Git\cmd"
)

$gitFound = $false
foreach ($path in $gitPaths) {
    if (Test-Path "$path\git.exe") {
        $env:Path = "$path;$env:Path"
        $gitFound = $true
        Write-Host "✓ 找到 Git: $path" -ForegroundColor Green
        break
    }
}

if (-not $gitFound) {
    Write-Host "⚠ 未找到 Git，请先安装 Git for Windows" -ForegroundColor Red
    Write-Host "  下载地址: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "安装完成后重新运行此脚本即可" -ForegroundColor Yellow
    Read-Host "按回车键退出"
    exit 1
}

try {
    $gitVersion = git --version
    Write-Host "  版本: $gitVersion" -ForegroundColor Gray
} catch {
    Write-Host "✗ Git 无法运行" -ForegroundColor Red
    exit 1
}

# 2. 初始化 Git 仓库
Write-Host ""
Write-Host "[2/6] 初始化 Git 仓库..." -ForegroundColor Yellow

Set-Location "c:\Users\杭州西路大魔王\Documents\tare_solo\stockflow"

if (Test-Path ".git") {
    Write-Host "✓ Git 仓库已存在" -ForegroundColor Green
} else {
    git init
    Write-Host "✓ Git 仓库初始化完成" -ForegroundColor Green
}

# 3. 配置用户信息
Write-Host ""
Write-Host "[3/6] 配置用户信息..." -ForegroundColor Yellow

git config user.name "$Username"
git config user.email "faker9407@163.com"
Write-Host "✓ 用户名: $Username" -ForegroundColor Green
Write-Host "✓ 邮箱: faker9407@163.com" -ForegroundColor Green

# 4. 添加所有文件
Write-Host ""
Write-Host "[4/6] 添加文件到暂存区..." -ForegroundColor Yellow

git add .
$fileCount = (git status --porcelain | Measure-Object).Count
Write-Host "✓ 已添加 $fileCount 个文件变更" -ForegroundColor Green

# 5. 创建初始提交
Write-Host ""
Write-Host "[5/6] 创建初始提交..." -ForegroundColor Yellow

$commitMessage = "Initial commit: StockFlow inventory management system

Features:
- Business backend (NestJS + PostgreSQL + Redis)
- Business frontend (Vue 3 + Vite + Element Plus)
- Admin backend (RBAC, JWT authentication)
- Admin frontend (System management dashboard)
- Docker deployment configuration
- Enterprise-grade security audit completed
- Complete documentation"

git commit -m $commitMessage
Write-Host "✓ 提交创建成功" -ForegroundColor Green

# 6. 重命名分支并推送到 GitHub
Write-Host ""
Write-Host "[6/6] 推送到 GitHub..." -ForegroundColor Yellow

git branch -M main

$remoteUrl = "https://${Token}@github.com/${Username}/${RepoName}.git"

# 移除旧的 remote（如果存在）
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    git remote remove origin
}

git remote add origin $remoteUrl
Write-Host "  远程仓库: https://github.com/${Username}/${RepoName}.git" -ForegroundColor Gray

git push -u origin main --force
Write-Host "✓ 推送成功！" -ForegroundColor Green

# 完成
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🎉 推送完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "仓库地址: https://github.com/${Username}/${RepoName}" -ForegroundColor Cyan
Write-Host ""

Read-Host "按回车键打开仓库页面..."

Start-Process "https://github.com/${Username}/${RepoName}"
