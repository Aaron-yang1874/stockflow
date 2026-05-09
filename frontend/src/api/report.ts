import request from './index'

export interface DashboardOverview {
  totalProducts: number
  totalWarehouses: number
  totalStockValue: number
  todayInboundCount: number
  todayInboundAmount: number
  todayOutboundCount: number
  todayOutboundAmount: number
  pendingPurchaseOrders: number
  pendingSalesOrders: number
  lowStockProducts: Array<{
    productId: string
    productName: string
    productSku: string
    currentQuantity: number
    minStockLevel: number
  }>
}

export interface StockSummaryItem {
  warehouseId: string
  warehouseName: string
  totalQuantity: number
  totalValue: number
}

export interface DailyRecord {
  date: string
  quantity: number
  amount: number
}

export interface TypeSummary {
  type: string
  quantity: number
  amount: number
}

export interface TurnoverItem {
  productId: string
  productName: string
  productSku: string
  inboundTotal: number
  outboundTotal: number
  currentStock: number
  turnoverRate: number
}

export interface SupplierAnalysisItem {
  supplierId: string
  supplierName: string
  purchaseCount: number
  totalAmount: number
  lastPurchaseDate: string | null
}

export interface CustomerAnalysisItem {
  customerId: string
  customerName: string
  salesCount: number
  totalAmount: number
  lastSaleDate: string | null
}

export type { DashboardOverview as DashboardData }
export type { StockSummaryItem, DailyRecord, TypeSummary, TurnoverItem, SupplierAnalysisItem, CustomerAnalysisItem }

export function getDashboard() {
  return request({ url: '/report/dashboard', method: 'get' })
}

export function getStockSummary(params?: Record<string, unknown>) {
  return request({ url: '/report/stock-summary', method: 'get', params })
}

export function getInboundReport(params?: Record<string, unknown>) {
  return request({ url: '/report/inbound', method: 'get', params })
}

export function getOutboundReport(params?: Record<string, unknown>) {
  return request({ url: '/report/outbound', method: 'get', params })
}

export function getTurnover(params?: Record<string, unknown>) {
  return request({ url: '/report/turnover', method: 'get', params })
}

export function getSupplierAnalysis(params?: Record<string, unknown>) {
  return request({ url: '/report/supplier', method: 'get', params })
}

export function getCustomerAnalysis(params?: Record<string, unknown>) {
  return request({ url: '/report/customer', method: 'get', params })
}