// 报名信息类型定义
export interface RegistrationInfo {
  id?: number;
  studentId: number;
  currentStep: string;
  completedSteps: string;
}

// 报名信息查询参数
export interface RegistrationInfoQueryParams {
  pageNum: number;
  pageSize: number;
  identityDocumentNumber?: string;
  studentName?: string;
}

// 报名信息列表响应
export interface RegistrationInfoListResponse {
  code: number;
  data: {
    records: RegistrationInfo[];
    total: number;
    size: number;
    current: number;
  };
  message: string;
}

// 报名信息详情响应
export interface RegistrationInfoDetailResponse {
  code: number;
  data: RegistrationInfo;
  message: string;
}

// 通用响应
export interface CommonResponse {
  code: number;
  message: string;
} 