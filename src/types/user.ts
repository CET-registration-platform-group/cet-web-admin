// 用户类型定义
export interface User {
  id?: number;
  username: string;
  password?: string;
  email?: string;
  phone?: string;
  realName?: string;
}

// 用户查询参数
export interface UserQueryParams {
  current: number;
  size: number;
  username?: string;
}

// 用户列表响应
export interface UserListResponse {
  code: number;
  data: {
    records: User[];
    total: number;
    size: number;
    current: number;
  };
  message: string;
}

// 用户详情响应
export interface UserDetailResponse {
  code: number;
  data: User;
  message: string;
}

// 通用响应
export interface CommonResponse {
  code: number;
  message: string;
} 