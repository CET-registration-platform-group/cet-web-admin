// 考场类型定义
export interface ExamRoom {
  id?: number;
  examSiteId: number;
  roomNumber: string;
}

// 考场查询参数
export interface ExamRoomQueryParams {
  pageNum: number;
  pageSize: number;
  examSiteId?: number;
  roomNumber?: string;
}

// 考场列表响应
export interface ExamRoomListResponse {
  code: number;
  data: {
    records: ExamRoom[];
    total: number;
    size: number;
    current: number;
  };
  message: string;
}

// 考场详情响应
export interface ExamRoomDetailResponse {
  code: number;
  data: ExamRoom;
  message: string;
}

// 通用响应
export interface CommonResponse {
  code: number;
  message: string;
} 