// 登录参数
export interface LoginParams {
  username: string;
  password: string;
}

// 登录响应数据
export interface LoginResponseData {
  token: string;
  refreshToken?: string;
  user: {
    id: number;
    username: string;
    realName?: string;
    email?: string;
    phone?: string;
  };
}

// 登录响应
export interface LoginResponse {
  code: number;
  data: LoginResponseData;
  message: string;
}

// 登出响应
export interface LogoutResponse {
  code: number;
  message: string;
}

// 刷新令牌响应
export interface RefreshTokenResponse {
  code: number;
  data: {
    token: string;
    refreshToken?: string;
  };
  message: string;
} 