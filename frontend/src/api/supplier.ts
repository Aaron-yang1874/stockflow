import request from './index'

export interface Supplier {
  id?: string
  code: string
  name: string
  contactPerson: string
  phone: string
  email?: string
  address?: string
  taxNo?: string
  bankAccount?: string
  bankName?: string
  rating?: number
  status?: string
  remark?: string
}

export function getSuppliers(params?: Record<string, unknown>) {
  return request({ url: '/suppliers', method: 'get', params })
}

export const getSupplierList = getSuppliers

export function getSupplier(id: string) {
  return request({ url: `/suppliers/${id}`, method: 'get' })
}

export function createSupplier(data: Partial<Supplier>) {
  return request({ url: '/suppliers', method: 'post', data })
}

export function updateSupplier(id: string, data: Partial<Supplier>) {
  return request({ url: `/suppliers/${id}`, method: 'patch', data })
}

export function deleteSupplier(id: string) {
  return request({ url: `/suppliers/${id}`, method: 'delete' })
}