# 推送到 GitHub 指南

## 仓库信息

- **用户名：** Aaron-yang1874
- **仓库名：** stockflow (建议)
- **分支：** main (默认)

## 步骤说明

### 1. 先在 GitHub 上创建仓库

访问 https://github.com/new
- Repository name: stockflow
- Public/Private: 根据需要选择
- 不要勾选 "Initialize this repository with a README" (我们已有了)

### 2. 在本地初始化并推送 (PowerShell 或 CMD)

```powershell
# 进入项目目录
cd "c:\Users\杭州西路大魔王\Documents\tare_solo\stockflow"

# 初始化 Git
git init

# 配置用户信息
git config user.name "Aaron-yang1874"
git config user.email "faker9407@163.com"

# 添加所有文件
git add .

# 创建第一次提交
git commit -m "Initial commit: StockFlow inventory management system"

# 重命名分支为 main
git branch -M main

# 添加远程仓库地址 (使用你的 token)
git remote add origin https://<YOUR_PERSONAL_ACCESS_TOKEN>@github.com/Aaron-yang1874/stockflow.git

# 推送到 GitHub
git push -u origin main
```

### 3. 如果需要创建不同的仓库名

将上面的 `stockflow` 替换为你的仓库名：
```
git remote add origin https://<YOUR_PERSONAL_ACCESS_TOKEN>@github.com/Aaron-yang1874/[你的仓库名].git
```

### 4. 如果遇到问题

**问题：** 提示 "Repository not found"
**解决：** 确保你已在 GitHub 上创建了仓库

**问题：** 权限问题
**解决：** 确认你的 Personal Access Token 有 repo 权限

**问题：** Windows 下没有 git 命令
**解决：** 安装 Git for Windows https://git-scm.com/download/win

## 重要提醒

⚠️ **删除 .env 文件中敏感信息后再推送！**

.env 文件已在 .gitignore 中，但为了安全，确保：
- 已将所有敏感配置（密码、JWT_SECRET）移到环境变量或安全的配置管理中
- 如果已经意外提交了，需要删除历史记录中的敏感信息
