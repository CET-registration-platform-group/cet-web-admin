import { ExamRoom, ApiResponse, PaginationResponse, QueryParams } from '@/types';
import request from './instance';
import { AxiosRequestConfig } from 'axios';

// 获取考场列表
export const getExamRoomList = async (params: QueryParams) => {
  const config: AxiosRequestConfig = {
    url: '/exam-room/list',
    method: 'GET',
    params
  };
  return request<ApiResponse<PaginationResponse<ExamRoom>>>(config);
};

// 获取考场详情
export const getExamRoomById = async (id: number) => {
  const config: AxiosRequestConfig = {
    url: `/exam-room/${id}`,
    method: 'GET'
  };
  return request<ApiResponse<ExamRoom>>(config);
};

// 创建考场
export const createExamRoom = async (examRoom: Partial<ExamRoom>) => {
  const config: AxiosRequestConfig = {
    url: '/exam-room',
    method: 'POST',
    data: examRoom
  };
  return request<ApiResponse<ExamRoom>>(config);
};

// 更新考场
export const updateExamRoom = async (examRoom: Partial<ExamRoom>) => {
  const config: AxiosRequestConfig = {
    url: '/exam-room',
    method: 'PUT',
    data: examRoom
  };
  return request<ApiResponse<ExamRoom>>(config);
};

// 删除考场
export const deleteExamRoom = async (id: number) => {
  const config: AxiosRequestConfig = {
    url: `/exam-room/${id}`,
    method: 'DELETE'
  };
  return request<ApiResponse<null>>(config);
}; 