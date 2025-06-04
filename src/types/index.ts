// 定义标准响应格式
export interface ApiResponse<T = any> {
  code: number;   // 200表示成功
  message: string;
  data: T;
}

// 定义用户信息
export interface UserInfo {
  id: number;
  username: string;
  email?: string;
  tel?: string;
}

// 登录请求参数
export interface LoginParams {
  username: string;
  password: string;
}

// 登录响应数据
export interface LoginResponseData {
  token: string;
  user: UserInfo;
}

// 考点
export interface ExamSite {
  id: number;
  name: string;
  address: string;
  totalSeat: number;
  usedSeat: number;
  createdAt?: string;
  updatedAt?: string;
}

// 考场
export interface ExamRoom {
  id: number;
  roomNumber: string;
  examSiteId: number;
  examSiteName?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 考试座位
export interface ExamSeat {
  id: number;
  seatNumber: string;
  examRoomId: number;
  examRoomNumber?: string;
  examSiteId?: number;
  examSiteName?: string;
  status: number; // 0-未占用，1-占用
  createdAt?: string;
  updatedAt?: string;
}

// 学生信息
export interface Student {
  id: number;
  name: string;
  identityDocumentType: number; // 0-身份证，1-护照
  identityDocumentNumber: string;
  email?: string;
  phone?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 考试信息
export interface ExamInfo {
  id: number;
  studentId: number;
  studentName?: string;
  examSeatId: number;
  seatNumber?: string;
  examRoomId?: number;
  roomNumber?: string;
  examSiteId?: number;
  examSiteName?: string;
  examTime: string;
  examType: string; // 笔试、口试
  examLevel: string; // 四级、六级
  createdAt?: string;
  updatedAt?: string;
}

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 分页响应
export interface PaginationResponse<T> {
  items?: T[];
  records?: T[];
  total: number;
  page?: number;
  pageSize?: number;
  size?: number;
  current?: number;
  totalPages?: number;
  pages?: number;
}

// 通用查询参数
export interface QueryParams extends Partial<PaginationParams> {
  [key: string]: any;
} 