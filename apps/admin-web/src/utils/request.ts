// API基础URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/admin'

// 请求拦截器 - 添加认证token
function getToken(): string | null {
  return localStorage.getItem('admin_token')
}

// 通用请求函数
async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers
  })
  
  const data = await response.json()
  
  // 服务端响应格式：code=0 成功，code=1 失败
  if (data.code !== 0) {
    throw new Error(data.message || '请求失败')
  }
  
  return data.data
}

// GET请求
export function get<T>(url: string, params?: Record<string, any>): Promise<T> {
  let queryUrl = url
  if (params) {
    const query = new URLSearchParams(params).toString()
    queryUrl = `${url}?${query}`
  }
  return request<T>(queryUrl, { method: 'GET' })
}

// POST请求
export function post<T>(url: string, body?: any): Promise<T> {
  return request<T>(url, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined
  })
}

// PUT请求
export function put<T>(url: string, body?: any): Promise<T> {
  return request<T>(url, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined
  })
}

// DELETE请求
export function del<T>(url: string): Promise<T> {
  return request<T>(url, { method: 'DELETE' })
}

export default { get, post, put, delete: del }
