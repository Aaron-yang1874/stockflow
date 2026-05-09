import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '../layout/MainLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/LoginView.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/layout',
    component: MainLayout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/DashboardView.vue'),
        meta: { title: '仪表盘', icon: 'Odometer' }
      },
      {
        path: '/products',
        name: 'Products',
        component: () => import('../views/product/ProductView.vue'),
        meta: { title: '产品管理', icon: 'Goods' }
      },
      {
        path: '/warehouses',
        name: 'Warehouses',
        component: () => import('../views/warehouse/WarehouseView.vue'),
        meta: { title: '仓库管理', icon: 'House' }
      },
      {
        path: '/inventory',
        name: 'Inventory',
        component: () => import('../views/inventory/InventoryView.vue'),
        meta: { title: '库存管理', icon: 'Box' }
      },
      {
        path: '/stock-in',
        name: 'StockIn',
        component: () => import('../views/stock-in/StockInView.vue'),
        meta: { title: '入库管理', icon: 'Top' }
      },
      {
        path: '/stock-out',
        name: 'StockOut',
        component: () => import('../views/stock-out/StockOutView.vue'),
        meta: { title: '出库管理', icon: 'Bottom' }
      },
      {
        path: '/suppliers',
        name: 'Suppliers',
        component: () => import('../views/supplier/SupplierView.vue'),
        meta: { title: '供应商管理', icon: 'Van' }
      },
      {
        path: '/customers',
        name: 'Customers',
        component: () => import('../views/customer/CustomerView.vue'),
        meta: { title: '客户管理', icon: 'User' }
      },
      {
        path: '/purchase-orders',
        name: 'PurchaseOrders',
        component: () => import('../views/purchase-order/PurchaseOrderView.vue'),
        meta: { title: '采购订单', icon: 'ShoppingCart' }
      },
      {
        path: '/sales-orders',
        name: 'SalesOrders',
        component: () => import('../views/sales-order/SalesOrderView.vue'),
        meta: { title: '销售订单', icon: 'SoldOut' }
      },
      {
        path: '/reports',
        name: 'Reports',
        component: () => import('../views/report/ReportView.vue'),
        meta: { title: '报表统计', icon: 'DataAnalysis' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
