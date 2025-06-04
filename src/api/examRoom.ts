import request from './instance';
import { API_PATHS } from '@/constants/api';
import type { ExamRoom, ExamRoomQueryParams, ExamRoomListResponse, ExamRoomDetailResponse, CommonResponse } from '@/types/exam-room';

// 获取考场列表
export const getExamRoomList = (params: ExamRoomQueryParams) => {
  return request<ExamRoomListResponse>({
    url: API_PATHS.ADMIN.EXAM_ROOMS.LIST,
    method: 'GET',
    params
  });
};

// 获取所有考场列表（不分页）
export const getAllExamRooms = (examSiteId?: number) => {
  return request<ExamRoomListResponse>({
    url: API_PATHS.ADMIN.EXAM_ROOMS.LIST_ALL,
    method: 'GET',
    params: examSiteId ? { examSiteId } : undefined
  });
};

// 创建考场
export const createExamRoom = (data: ExamRoom) => {
  return request<CommonResponse>({
    url: API_PATHS.ADMIN.EXAM_ROOMS.CREATE,
    method: 'POST',
    data
  });
};

// 更新考场
export const updateExamRoom = (data: ExamRoom) => {
  return request<CommonResponse>({
    url: API_PATHS.ADMIN.EXAM_ROOMS.UPDATE,
    method: 'PUT',
    data
  });
};

// 删除考场
export const deleteExamRoom = (id: number) => {
  return request<CommonResponse>({
    url: API_PATHS.ADMIN.EXAM_ROOMS.DELETE(id),
    method: 'DELETE'
  });
};

// 获取考场详情
export const getExamRoomDetail = (id: number) => {
  return request<ExamRoomDetailResponse>({
    url: API_PATHS.ADMIN.EXAM_ROOMS.DETAIL(id),
    method: 'GET'
  });
}; 