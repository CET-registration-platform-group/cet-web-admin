import request from './instance';
import { API_PATHS } from '@/constants/api';
import type { ExamSeat, ExamSeatQueryParams, ExamSeatListResponse, ExamSeatDetailResponse, CommonResponse } from '@/types/exam-seat';

// 获取考试座位列表
export const getExamSeatList = (params: ExamSeatQueryParams) => {
  return request<ExamSeatListResponse>({
    url: API_PATHS.ADMIN.EXAM_SEATS.LIST,
    method: 'GET',
    params
  });
};

// 创建考试座位（支持单个或批量）
export const createExamSeat = (data: ExamSeat) => {
  return request<CommonResponse>({
    url: API_PATHS.ADMIN.EXAM_SEATS.CREATE,
    method: 'POST',
    data
  });
};

// 批量创建座位
export const batchCreateExamSeats = (data: ExamSeat[]) => {
  return request<CommonResponse>({
    url: API_PATHS.ADMIN.EXAM_SEATS.BATCH_CREATE,
    method: 'POST',
    data
  });
};

// 更新考试座位
export const updateExamSeat = (data: ExamSeat) => {
  return request<CommonResponse>({
    url: API_PATHS.ADMIN.EXAM_SEATS.UPDATE,
    method: 'PUT',
    data
  });
};

// 删除考试座位
export const deleteExamSeat = (id: number) => {
  return request<CommonResponse>({
    url: API_PATHS.ADMIN.EXAM_SEATS.DELETE(id),
    method: 'DELETE'
  });
};

// 获取考试座位详情
export const getExamSeatDetail = (id: number) => {
  return request<ExamSeatDetailResponse>({
    url: API_PATHS.ADMIN.EXAM_SEATS.DETAIL(id),
    method: 'GET'
  });
}; 