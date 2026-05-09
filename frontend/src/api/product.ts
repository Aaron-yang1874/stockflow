import request from './index'

export interface Product {
  id?: string
  sku: string
  name: string
  category: string
  unit: string
  spec?: string
  costPrice: number
  salePrice: number
  minStock: number
  description?: string
  status?: string
}

export function getProducts(params?: Record<string, unknown>) {
  return request({ url: '/products', method: 'get', params })
}

export const getProductList = getProducts

export function getProduct(id: string) {
  return request({ url: `/products/${id}`, method: 'get' })
}

export function createProduct(data: Partial<Product>) {
  return request({ url: '/products', method: 'post', data })
}

export function updateProduct(id: string, data: Partial<Product>) {
  return request({ url: `/products/${id}`, method: 'patch', data })
}

export function deleteProduct(id: string) {
  return request({ url: `/products/${id}`, method: 'delete' })
}