import request from './index'

export interface Warehouse {
  id?: string
  code: string
  name: string
  address?: string
  manager?: string
  phone?: string
  capacity?: number
  status?: string
}

export function getWarehouses(params?: Record<string, unknown>) {
  return request({ url: '/warehouses', method: 'get', params })
}

export const getWarehouseList = getWarehouses

export function getWarehouse(id: string) {
  return request({ url: `/warehouses/${id}`, method: 'get' })
}

export function createWarehouse(data: Partial<Warehouse>) {
  return request({ url: '/warehouses', method: 'post', data })
}

export function updateWarehouse(id: string, data: Partial<Warehouse>) {
  return request({ url: `/warehouses/${id}`, method: 'patch', data })
}

export function deleteWarehouse(id: string) {
  return request({ url: `/warehouses/${id}`, method: 'delete' })
}