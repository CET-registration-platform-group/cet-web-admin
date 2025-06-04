import request from './instance';
import { API_PATHS } from '@/constants/api';
import type { LoginParams, LoginResponse, LogoutResponse, RefreshTokenResponse } from '@/types/auth';

console.log('auth API 初始化');
console.log('登录API路径:', API_PATHS.ADMIN.AUTH.LOGIN);

// 登录接口
export const login = (data: LoginParams) => {
  console.log('调用登录API，参数:', data);
  console.log('登录API路径:', API_PATHS.ADMIN.AUTH.LOGIN);
  
  return request<LoginResponse>({
    url: API_PATHS.ADMIN.AUTH.LOGIN,
    method: 'POST',
    data
  });
};


// 登出接口
export const logout = () => {
  return request<LogoutResponse>({
    url: API_PATHS.ADMIN.AUTH.LOGOUT,
    method: 'POST'
  });
};

// 获取当前用户信息接口
export function getCurrentUser() {
  return request({
    url: '/api/admin/user/current',
    method: 'get'
  });
}

// 刷新token接口
export const refreshToken = () => {
  return request<RefreshTokenResponse>({
    url: API_PATHS.ADMIN.AUTH.REFRESH_TOKEN,
    method: 'POST'
  });
}; 