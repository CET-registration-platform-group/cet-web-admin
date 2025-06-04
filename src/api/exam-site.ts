import request from './instance';
import { API_PATHS } from '@/constants/api';
import type { ExamSite, ExamSiteQueryParams, ExamSiteListResponse, ExamSiteDetailResponse, CommonResponse } from '@/types/exam-site';

// 获取考试场地列表
export const getExamSiteList = (params: ExamSiteQueryParams) => {
  return request<ExamSiteListResponse>({
    url: API_PATHS.ADMIN.EXAM_SITES.LIST,
    method: 'GET',
    params
  });
};

// 创建考试场地
export const createExamSite = (data: ExamSite) => {
  return request<CommonResponse>({
    url: API_PATHS.ADMIN.EXAM_SITES.CREATE,
    method: 'POST',
    data
  });
};

// 更新考试场地
export const updateExamSite = (data: ExamSite) => {
  return request<CommonResponse>({
    url: API_PATHS.ADMIN.EXAM_SITES.UPDATE,
    method: 'PUT',
    data
  });
};

// 删除考试场地
export const deleteExamSite = (id: number) => {
  return request<CommonResponse>({
    url: API_PATHS.ADMIN.EXAM_SITES.DELETE(id),
    method: 'DELETE'
  });
};

// 获取考试场地详情
export const getExamSiteDetail = (id: number) => {
  return request<ExamSiteDetailResponse>({
    url: API_PATHS.ADMIN.EXAM_SITES.DETAIL(id),
    method: 'GET'
  });
}; 