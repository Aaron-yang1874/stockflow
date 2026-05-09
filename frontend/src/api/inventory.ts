import request from './index'

export interface InventoryItem {
  id?: number
  productId: number
  productName: string
  warehouseId: number
  warehouseName: string
  quantity: number
  minStock: number
  maxStock: number
  unit: string
}

export function getInventories(params?: Record<string, unknown>) {
  return request({ url: '/inventory', method: 'get', params })
}

export function getInventoryByProduct(productId: number, warehouseId: number) {
  return request({
    url: '/inventory/detail',
    method: 'get',
    params: { productId, warehouseId }
  })
}

export function getLowStockAlerts() {
  return request({ url: '/inventory/alerts/low-stock', method: 'get' })
}

export function adjustInventory(data: { productId: number; warehouseId: number; quantity: number; reason: string }) {
  return request({ url: '/inventory/adjust', method: 'post', data })
}
