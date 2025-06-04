import { ExamSeat, ApiResponse, PaginationResponse, QueryParams } from '@/types';
import request from './instance';
import { AxiosRequestConfig } from 'axios';

// 获取考试座位列表
export const getExamSeatList = async (params: QueryParams) => {
  const config: AxiosRequestConfig = {
    url: '/exam-seat/list',
    method: 'GET',
    params
  };
  return request<ApiResponse<PaginationResponse<ExamSeat>>>(config);
};

// 获取考试座位详情
export const getExamSeatById = async (id: number) => {
  const config: AxiosRequestConfig = {
    url: `/exam-seat/${id}`,
    method: 'GET'
  };
  return request<ApiResponse<ExamSeat>>(config);
};

// 创建考试座位
export const createExamSeat = async (examSeat: Partial<ExamSeat>) => {
  const config: AxiosRequestConfig = {
    url: '/exam-seat',
    method: 'POST',
    data: examSeat
  };
  return request<ApiResponse<ExamSeat>>(config);
};

// 更新考试座位
export const updateExamSeat = async (examSeat: Partial<ExamSeat>) => {
  const config: AxiosRequestConfig = {
    url: '/exam-seat',
    method: 'PUT',
    data: examSeat
  };
  return request<ApiResponse<ExamSeat>>(config);
};

// 删除考试座位
export const deleteExamSeat = async (id: number) => {
  const config: AxiosRequestConfig = {
    url: `/exam-seat/${id}`,
    method: 'DELETE'
  };
  return request<ApiResponse<null>>(config);
}; 