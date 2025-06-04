import { ExamInfo, ApiResponse, PaginationResponse, QueryParams } from '@/types';
import request from './instance';
import { AxiosRequestConfig } from 'axios';

// 获取考试信息列表
export const getExamInfoList = async (params: QueryParams) => {
  const config: AxiosRequestConfig = {
    url: '/exam-info/list',
    method: 'GET',
    params
  };
  return request<ApiResponse<PaginationResponse<ExamInfo>>>(config);
};

// 获取考试信息详情
export const getExamInfoById = async (id: number) => {
  const config: AxiosRequestConfig = {
    url: `/exam-info/${id}`,
    method: 'GET'
  };
  return request<ApiResponse<ExamInfo>>(config);
};

// 创建考试信息
export const createExamInfo = async (examInfo: Partial<ExamInfo>) => {
  const config: AxiosRequestConfig = {
    url: '/exam-info',
    method: 'POST',
    data: examInfo
  };
  return request<ApiResponse<ExamInfo>>(config);
};

// 更新考试信息
export const updateExamInfo = async (examInfo: Partial<ExamInfo>) => {
  const config: AxiosRequestConfig = {
    url: '/exam-info',
    method: 'PUT',
    data: examInfo
  };
  return request<ApiResponse<ExamInfo>>(config);
};

// 删除考试信息
export const deleteExamInfo = async (id: number) => {
  const config: AxiosRequestConfig = {
    url: `/exam-info/${id}`,
    method: 'DELETE'
  };
  return request<ApiResponse<null>>(config);
}; 