import { ExamSite, ApiResponse, PaginationResponse, QueryParams } from '@/types';
import request from './instance';
import { AxiosRequestConfig } from 'axios';

// 获取考点列表
export const getExamSiteList = async (params: QueryParams) => {
  const config: AxiosRequestConfig = {
    url: '/exam-site/list',
    method: 'GET',
    params
  };
  return request<ApiResponse<PaginationResponse<ExamSite>>>(config);
};

// 获取考点详情
export const getExamSiteById = async (id: number) => {
  const config: AxiosRequestConfig = {
    url: `/exam-site/${id}`,
    method: 'GET'
  };
  return request<ApiResponse<ExamSite>>(config);
};

// 创建考点
export const createExamSite = async (examSite: Partial<ExamSite>) => {
  const config: AxiosRequestConfig = {
    url: '/exam-site',
    method: 'POST',
    data: examSite
  };
  return request<ApiResponse<ExamSite>>(config);
};

// 更新考点
export const updateExamSite = async (examSite: Partial<ExamSite>) => {
  const config: AxiosRequestConfig = {
    url: '/exam-site',
    method: 'PUT',
    data: examSite
  };
  return request<ApiResponse<ExamSite>>(config);
};

// 删除考点
export const deleteExamSite = async (id: number) => {
  const config: AxiosRequestConfig = {
    url: `/exam-site/${id}`,
    method: 'DELETE'
  };
  return request<ApiResponse<null>>(config);
}; 