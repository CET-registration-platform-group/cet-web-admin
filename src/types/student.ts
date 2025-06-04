// 学生类型定义
export interface Student {
  id?: number;
  identityDocumentType?: number;  // 0: 身份证, 1: 护照
  identityDocumentNumber: string;
  name: string;
  email?: string;
  phone?: string;
  password?: string;
}

// 学生查询参数
export interface StudentQueryParams {
  pageNum: number;
  pageSize: number;
  email?: string;
  idNumber?: string;
  name?: string;
}

// 学生列表响应
export interface StudentListResponse {
  code: number;
  data: {
    records: Student[];
    total: number;
    size: number;
    current: number;
  };
  message: string;
}

// 学生详情响应
export interface StudentDetailResponse {
  code: number;
  data: Student;
  message: string;
}

// 通用响应
export interface CommonResponse {
  code: number;
  message: string;
} 