import request from './instance';
import { API_PATHS } from '@/constants/api';
import type { ExamInfo, ExamInfoQueryParams, ExamInfoListResponse, ExamInfoDetailResponse, CommonResponse } from '@/types/exam-info';

// 获取考试信息列表
export const getExamInfoList = (params: ExamInfoQueryParams) => {
  return request<ExamInfoListResponse>({
    url: API_PATHS.ADMIN.EXAM_INFOS.LIST,
    method: 'GET',
    params
  });
};

// 创建考试信息
export const createExamInfo = (data: ExamInfo) => {
  return request<CommonResponse>({
    url: API_PATHS.ADMIN.EXAM_INFOS.CREATE,
    method: 'POST',
    data
  });
};

// 更新考试信息
export const updateExamInfo = (data: ExamInfo) => {
  return request<CommonResponse>({
    url: API_PATHS.ADMIN.EXAM_INFOS.UPDATE,
    method: 'PUT',
    data
  });
};

// 删除考试信息
export const deleteExamInfo = (id: number) => {
  return request<CommonResponse>({
    url: API_PATHS.ADMIN.EXAM_INFOS.DELETE(id),
    method: 'DELETE'
  });
};

// 获取考试信息详情
export const getExamInfoDetail = (id: number) => {
  return request<ExamInfoDetailResponse>({
    url: API_PATHS.ADMIN.EXAM_INFOS.DETAIL(id),
    method: 'GET'
  });
}; 