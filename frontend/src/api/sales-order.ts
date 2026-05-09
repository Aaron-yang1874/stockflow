import request from './index'

export interface SalesOrderItemForm {
  productId: string
  quantity: number
  unitPrice: number
  taxRate: number
  amount?: number
}

export interface SalesOrder {
  id?: string
  orderNo: string
  customerId: string
  totalAmount: number
  taxAmount?: number
  discountAmount?: number
  finalAmount?: number
  status: string
  paymentStatus?: string
  deliveryDate?: string
  remark?: string
  operatedBy?: string
  createdAt?: string
  items?: SalesOrderItemForm[]
}

export function getSalesOrders(params?: Record<string, unknown>) {
  return request({ url: '/sales-orders', method: 'get', params })
}

export const getSalesOrderList = getSalesOrders

export function getSalesOrder(id: string) {
  return request({ url: `/sales-orders/${id}`, method: 'get' })
}

export const getSalesOrderDetail = getSalesOrder

export function createSalesOrder(data: Partial<SalesOrder>) {
  return request({ url: '/sales-orders', method: 'post', data })
}

export function updateSalesOrder(id: string, data: Partial<SalesOrder>) {
  return request({ url: `/sales-orders/${id}`, method: 'patch', data })
}

export function deleteSalesOrder(id: string) {
  return request({ url: `/sales-orders/${id}`, method: 'delete' })
}