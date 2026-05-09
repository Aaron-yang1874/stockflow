import request from './index'

export interface Customer {
  id?: string
  code: string
  name: string
  contactPerson: string
  phone: string
  email?: string
  address?: string
  level?: string
  creditLimit?: number
  status?: string
  remark?: string
}

export function getCustomers(params?: Record<string, unknown>) {
  return request({ url: '/customers', method: 'get', params })
}

export const getCustomerList = getCustomers

export const getCustomerAll = getCustomers

export function getCustomer(id: string) {
  return request({ url: `/customers/${id}`, method: 'get' })
}

export function createCustomer(data: Partial<Customer>) {
  return request({ url: '/customers', method: 'post', data })
}

export function updateCustomer(id: string, data: Partial<Customer>) {
  return request({ url: `/customers/${id}`, method: 'patch', data })
}

export function deleteCustomer(id: string) {
  return request({ url: `/customers/${id}`, method: 'delete' })
}