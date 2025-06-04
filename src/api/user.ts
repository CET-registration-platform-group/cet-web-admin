import request from './instance';
import { API_PATHS } from '@/constants/api';
import type { User, UserQueryParams, UserListResponse, UserDetailResponse, CommonResponse } from '@/types/user';

// 获取用户列表
export const getUserList = (params: UserQueryParams) => {
  return request<UserListResponse>({
    url: API_PATHS.ADMIN.USERS.LIST,
    method: 'GET',
    params
  });
};

// 创建用户
export const createUser = (data: User) => {
  return request<CommonResponse>({
    url: API_PATHS.ADMIN.USERS.CREATE,
    method: 'POST',
    data
  });
};

// 更新用户
export const updateUser = (data: User) => {
  return request<CommonResponse>({
    url: API_PATHS.ADMIN.USERS.UPDATE,
    method: 'PUT',
    data
  });
};

// 删除用户
export const deleteUser = (id: number) => {
  return request<CommonResponse>({
    url: API_PATHS.ADMIN.USERS.DELETE(id),
    method: 'DELETE'
  });
};

// 获取用户详情
export const getUserDetail = (id: number) => {
  return request<UserDetailResponse>({
    url: API_PATHS.ADMIN.USERS.DETAIL(id),
    method: 'GET'
  });
}; 