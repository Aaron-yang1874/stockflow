import request from './index'

export interface StockInItem {
  id?: number
  orderNo: string
  productId: number
  productName: string
  warehouseId: number
  warehouseName: string
  quantity: number
  unitPrice: number
  supplierId?: number
  supplierName?: string
  batchNo?: string
  remark?: string
  status: number
  operator?: string
  createdAt?: string
}

export function getStockInList(params?: Record<string, unknown>) {
  return request({ url: '/stock-in', method: 'get', params })
}

export function getStockIn(id: number) {
  return request({ url: `/stock-in/${id}`, method: 'get' })
}

export function createStockIn(data: Omit<StockInItem, 'id' | 'createdAt'>) {
  return request({ url: '/stock-in', method: 'post', data })
}

export function updateStockIn(id: number, data: Partial<StockInItem>) {
  return request({ url: `/stock-in/${id}`, method: 'put', data })
}

export function deleteStockIn(id: number) {
  return request({ url: `/stock-in/${id}`, method: 'delete' })
}

export function confirmStockIn(id: number) {
  return request({ url: `/stock-in/${id}/confirm`, method: 'post' })
}
