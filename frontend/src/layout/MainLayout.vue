<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Odometer,
  Goods,
  House,
  Box,
  Top,
  Bottom,
  Van,
  User,
  ShoppingCart,
  SoldOut,
  DataAnalysis,
  Fold,
  Expand
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const isCollapse = ref(false)

const menuList = [
  { index: '/dashboard', title: '仪表盘', icon: Odometer },
  { index: '/products', title: '产品管理', icon: Goods },
  { index: '/warehouses', title: '仓库管理', icon: House },
  { index: '/inventory', title: '库存管理', icon: Box },
  { index: '/stock-in', title: '入库管理', icon: Top },
  { index: '/stock-out', title: '出库管理', icon: Bottom },
  { index: '/suppliers', title: '供应商', icon: Van },
  { index: '/customers', title: '客户', icon: User },
  { index: '/purchase-orders', title: '采购订单', icon: ShoppingCart },
  { index: '/sales-orders', title: '销售订单', icon: SoldOut },
  { index: '/reports', title: '报表统计', icon: DataAnalysis }
]

const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  return matched.map(item => ({
    name: (item.meta.title as string) || '',
    path: item.path
  }))
})

function toggleCollapse() {
  isCollapse.value = !isCollapse.value
}

function handleLogout() {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '220px'" class="aside-menu">
      <div class="logo-container">
        <span v-if="!isCollapse" class="logo-text">库存管理系统</span>
        <span v-else class="logo-text-mini">库存</span>
      </div>
      <el-menu
        :default-active="route.path"
        :collapse="isCollapse"
        router
        background-color="#001529"
        text-color="#ffffffa6"
        active-text-color="#1890ff"
        class="side-menu"
      >
        <el-menu-item
          v-for="menu in menuList"
          :key="menu.index"
          :index="menu.index"
        >
          <el-icon><component :is="menu.icon" /></el-icon>
          <template #title>{{ menu.title }}</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header-bar">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="toggleCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item
              v-for="item in breadcrumbs"
              :key="item.path"
            >
              {{ item.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <span class="system-name">库存管理系统</span>
          <el-button type="danger" size="small" text @click="handleLogout">
            退出登录
          </el-button>
        </div>
      </el-header>

      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container {
  height: 100vh;
  width: 100%;
}

.aside-menu {
  background-color: #001529;
  transition: width 0.3s;
  overflow-x: hidden;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #002140;
  overflow: hidden;
}

.logo-text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  letter-spacing: 2px;
}

.logo-text-mini {
  color: #1890ff;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.side-menu {
  border-right: none;
  height: calc(100vh - 60px);
}

.side-menu .el-menu-item:hover {
  background-color: #000c17 !important;
}

.side-menu .el-menu-item.is-active {
  background-color: #1890ff !important;
}

.header-bar {
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: #333;
  transition: color 0.3s;
}

.collapse-btn:hover {
  color: #1890ff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.system-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}
</style>
