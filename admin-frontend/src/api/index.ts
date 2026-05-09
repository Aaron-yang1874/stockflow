import axios from 'axios'

const request = axios.create({
  baseURL: '/api/admin',
  timeout: 15000
})

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const authApi = {
  login: (data: { username: string; password: string }) => request.post('/auth/login', data),
  profile: () => request.get('/auth/profile')
}

export const userApi = {
  list: () => request.get('/users'),
  get: (id: string) => request.get(`/users/${id}`),
  create: (data: any) => request.post('/users', data),
  update: (id: string, data: any) => request.put(`/users/${id}`, data),
  delete: (id: string) => request.delete(`/users/${id}`)
}

export const roleApi = {
  list: () => request.get('/roles'),
  get: (id: string) => request.get(`/roles/${id}`),
  create: (data: any) => request.post('/roles', data),
  update: (id: string, data: any) => request.put(`/roles/${id}`, data),
  delete: (id: string) => request.delete(`/roles/${id}`)
}

export const permissionApi = {
  list: () => request.get('/permissions'),
  get: (id: string) => request.get(`/permissions/${id}`),
  create: (data: any) => request.post('/permissions', data),
  update: (id: string, data: any) => request.put(`/permissions/${id}`, data),
  delete: (id: string) => request.delete(`/permissions/${id}`)
}

export const deptApi = {
  list: () => request.get('/depts'),
  get: (id: string) => request.get(`/depts/${id}`),
  create: (data: any) => request.post('/depts', data),
  update: (id: string, data: any) => request.put(`/depts/${id}`, data),
  delete: (id: string) => request.delete(`/depts/${id}`)
}

export const dictApi = {
  list: () => request.get('/dicts'),
  get: (id: string) => request.get(`/dicts/${id}`),
  create: (data: any) => request.post('/dicts', data),
  update: (id: string, data: any) => request.put(`/dicts/${id}`, data),
  delete: (id: string) => request.delete(`/dicts/${id}`),
  items: (code: string) => request.get(`/dicts/code/${code}/items`)
}

export const configApi = {
  list: () => request.get('/configs'),
  get: (id: string) => request.get(`/configs/${id}`),
  create: (data: any) => request.post('/configs', data),
  update: (id: string, data: any) => request.put(`/configs/${id}`, data),
  delete: (id: string) => request.delete(`/configs/${id}`),
  byKey: (key: string) => request.get(`/configs/key/${key}`)
}

export const logApi = {
  operations: () => request.get('/logs/operations'),
  logins: () => request.get('/logs/logins')
}

export const fileApi = {
  list: () => request.get('/files'),
  delete: (id: string) => request.delete(`/files/${id}`)
}

export default request