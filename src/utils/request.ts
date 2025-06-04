import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import authUtils from './auth'
import type { ApiResponse } from '@/types'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 使用环境变量中的API基础URL
  timeout: 15000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = authUtils.getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data as ApiResponse
    
    // 如果响应成功
    if (res.code === 200) {
      return response
    }
    
    // 处理其他状态码
    ElMessage.error(res.message || '请求失败')
    return Promise.reject(new Error(res.message || '请求失败'))
  },
  (error) => {
    console.error('响应错误:', error)
    ElMessage.error(error.message || '请求失败')
    return Promise.reject(error)
  }
)

// 封装请求方法
const request = {
  get<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
    return service.get(url, { params }).then(res => res.data as ApiResponse<T>)
  },
  
  post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return service.post(url, data).then(res => res.data as ApiResponse<T>)
  },
  
  put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return service.put(url, data).then(res => res.data as ApiResponse<T>)
  },
  
  delete<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
    return service.delete(url, { params }).then(res => res.data as ApiResponse<T>)
  }
}

export default request 