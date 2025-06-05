// 考试信息类型定义
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
  examType: string;
  examLevel: string;
  createdAt?: string;
  updatedAt?: string;
}

// 考试信息查询参数
export interface ExamInfoQueryParams {
  pageNum: number;
  pageSize: number;
  examTime?: string;
  examType?: string;
}

// 考试信息列表响应
export interface ExamInfoListResponse {
  code: number;
  data: {
    records: ExamInfo[];
    total: number;
    size: number;
    current: number;
  };
  message: string;
}

// 考试信息详情响应
export interface ExamInfoDetailResponse {
  code: number;
  data: ExamInfo;
  message: string;
}

// 通用响应
export interface CommonResponse {
  code: number;
  message: string;
} 