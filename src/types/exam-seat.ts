// 考试座位类型定义
export interface ExamSeat {
  id?: number;
  examSiteId: number;
  examRoomId: number;
  status: number;  // 0: 空闲, 1: 已分配
  seatNumber: string;
}

// 考试座位查询参数
export interface ExamSeatQueryParams {
  pageNum: number;
  pageSize: number;
  examSiteId?: number;
  examRoomId?: number;
  seatNumber?: string;
  status?: number;
}

// 考试座位列表响应
export interface ExamSeatListResponse {
  code: number;
  data: {
    records: ExamSeat[];
    total: number;
    size: number;
    current: number;
  };
  message: string;
}

// 考试座位详情响应
export interface ExamSeatDetailResponse {
  code: number;
  data: ExamSeat;
  message: string;
}

// 通用响应
export interface CommonResponse {
  code: number;
  message: string;
} 