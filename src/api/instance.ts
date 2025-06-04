import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import authUtils from '@/utils/auth';
import router from '@/router';
import { API_CONFIG, RESPONSE_CODE, ROUTE_PATHS } from '@/constants/api';

console.log('api/instance.ts 初始化');
console.log('API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);

// 创建axios实例
const instance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    console.log('发送请求:', config.url, config.method, config.data);
    
    // 获取token
    const token = authUtils.getToken();
    console.log('当前token:', token ? token.substring(0, 20) + '...' : 'null');
    
    if (token) {
      // 确保headers对象存在
      config.headers = config.headers || {};
      // 设置Authorization头
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('已设置Authorization头:', config.headers['Authorization'].substring(0, 20) + '...');
    } else {
      console.warn('未找到token，请求将不带Authorization头');
    }
    
    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('收到响应:', response.config.url, response.status, response.data);
    
    // 如果响应成功
    if (response.data.code === RESPONSE_CODE.SUCCESS) {
      return response.data;
    }
    
    // 处理业务错误
    ElMessage.error(response.data.message || '请求失败');
    return Promise.reject(response.data);
  },
  (error) => {
    console.error('响应错误:', error);
    
    // 处理401错误
    if (error.response?.status === RESPONSE_CODE.UNAUTHORIZED) {
      // 清除认证信息
      authUtils.clearAuth();
      // 重定向到登录页
      window.location.href = '/auth';
      return Promise.reject(error);
    }
    
    // 处理其他错误
    ElMessage.error(error.response?.data?.message || '服务器错误');
    return Promise.reject(error);
  }
);

// 处理未授权情况的辅助函数
const handleUnauthorized = (message: string) => {
  // 显示错误消息
  try {
    ElMessage.closeAll(); // 关闭所有已有消息
    ElMessage({
      message,
      type: 'error',
      duration: 5000,
      showClose: true
    });
  } catch (err) {
    console.error('显示消息失败:', err);
  }
  
  // 使用认证工具清除登录状态
  authUtils.clearAuth();
  
  // 强制延时确保UI更新
  setTimeout(() => {
    try {
      // 获取当前路由
      const currentPath = router.currentRoute.value.path;
      
      // 如果当前不在登录页，则跳转到登录页
      if (currentPath !== ROUTE_PATHS.AUTH) {
        // 使用replace而不是push，避免用户点击返回按钮时回到需要认证的页面
        router.replace({
          path: ROUTE_PATHS.AUTH,
          // 可以添加查询参数，记录用户之前访问的页面
          query: { redirect: currentPath }
        }).catch(err => {
          console.error('路由跳转失败，尝试强制跳转:', err);
          // 如果路由跳转失败，尝试强制刷新到登录页
          window.location.href = ROUTE_PATHS.AUTH;
        });
      }
    } catch (err) {
      console.error('路由处理失败:', err);
      // 出现错误时强制跳转
      window.location.href = ROUTE_PATHS.AUTH;
    }
  }, 100); // 短暂延时确保UI更新
};

// 封装请求方法
const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  console.log('发起请求:', config.url, config.method, config.data);
  return instance.request<any, T>(config);
};

export default request; 