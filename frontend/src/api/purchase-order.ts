import request from './index'

export interface PurchaseOrder {
  id?: number
  orderNo: string
  supplierId: number
  supplierName: string
  items: PurchaseOrderItem[]
  totalAmount: number
  status: number
  remark?: string
  createdAt?: string
}

export interface PurchaseOrderItem {
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  amount: number
}

export function getPurchaseOrders(params?: Record<string, unknown>) {
  return request({ url: '/purchase-orders', method: 'get', params })
}

export function getPurchaseOrder(id: number) {
  return request({ url: `/purchase-orders/${id}`, method: 'get' })
}

export function createPurchaseOrder(data: Omit<PurchaseOrder, 'id' | 'createdAt'>) {
  return request({ url: '/purchase-orders', method: 'post', data })
}

export function updatePurchaseOrder(id: number, data: Partial<PurchaseOrder>) {
  return request({ url: `/purchase-orders/${id}`, method: 'put', data })
}

export function deletePurchaseOrder(id: number) {
  return request({ url: `/purchase-orders/${id}`, method: 'delete' })
}

export function updatePurchaseOrderStatus(id: number, status: number) {
  return request({ url: `/purchase-orders/${id}/status`, method: 'put', data: { status } })
}
