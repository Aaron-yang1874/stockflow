<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/dashboard">
          <el-icon><data-analysis /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-sub-menu index="system">
          <template #title>
            <el-icon><setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/system/user">用户管理</el-menu-item>
          <el-menu-item index="/system/role">角色管理</el-menu-item>
          <el-menu-item index="/system/permission">权限管理</el-menu-item>
          <el-menu-item index="/system/dept">部门管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="tool">
          <template #title>
            <el-icon><tools /></el-icon>
            <span>系统工具</span>
          </template>
          <el-menu-item index="/tool/dict">字典管理</el-menu-item>
          <el-menu-item index="/tool/config">参数配置</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="monitor">
          <template #title>
            <el-icon><monitor /></el-icon>
            <span>系统监控</span>
          </template>
          <el-menu-item index="/monitor/log">日志管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <el-icon><user /></el-icon>
              Admin
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()
const activeMenu = computed(() => route.path)

const handleCommand = async (command: string) => {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出吗?')
      localStorage.removeItem('token')
      router.push('/login')
    } catch {
    }
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}
.el-aside {
  background-color: #304156;
}
.el-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
}
.header-right {
  display: flex;
  align-items: center;
}
.el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>