import request from './index'

export interface StockOutItem {
  id?: number
  orderNo: string
  productId: number
  productName: string
  warehouseId: number
  warehouseName: string
  quantity: number
  unitPrice: number
  customerId?: number
  customerName?: string
  batchNo?: string
  remark?: string
  status: number
  operator?: string
  createdAt?: string
}

export function getStockOutList(params?: Record<string, unknown>) {
  return request({ url: '/stock-out', method: 'get', params })
}

export function getStockOut(id: string) {
  return request({ url: `/stock-out/${id}`, method: 'get' })
}

export const getStockOutDetail = getStockOut

export function createStockOut(data: Omit<StockOutItem, 'id' | 'createdAt'>) {
  return request({ url: '/stock-out', method: 'post', data })
}

export function updateStockOut(id: number, data: Partial<StockOutItem>) {
  return request({ url: `/stock-out/${id}`, method: 'put', data })
}

export function deleteStockOut(id: number) {
  return request({ url: `/stock-out/${id}`, method: 'delete' })
}

export function confirmStockOut(id: number) {
  return request({ url: `/stock-out/${id}/confirm`, method: 'post' })
}
