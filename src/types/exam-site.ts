// 考点类型定义
export interface ExamSite {
  id?: number;
  name: string;
  address: string;
}

// 考点查询参数
export interface ExamSiteQueryParams {
  pageNum: number;
  pageSize: number;
  name?: string;
}

// 考点列表响应（分页）
export interface ExamSiteListResponse {
  code: number;
  data: {
    records: ExamSite[];
    total: number;
    size: number;
    current: number;
  };
  message: string;
}

// 考点列表响应（不分页）
export interface ExamSiteAllListResponse {
  code: number;
  data: ExamSite[];
  message: string;
}

// 考点详情响应
export interface ExamSiteDetailResponse {
  code: number;
  data: ExamSite;
  message: string;
}

// 通用响应
export interface CommonResponse {
  code: number;
  message: string;
} 