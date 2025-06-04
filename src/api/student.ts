import { Student, ApiResponse, PaginationResponse, QueryParams } from '@/types';
import request from './instance';
import { AxiosRequestConfig } from 'axios';

// 获取学生列表
export const getStudentList = async (params: QueryParams) => {
  const config: AxiosRequestConfig = {
    url: '/student/list',
    method: 'GET',
    params
  };
  console.log('请求学生列表，参数:', params);
  return request<ApiResponse<PaginationResponse<Student>>>(config);
};

// 获取学生详情
export const getStudentById = async (id: number) => {
  const config: AxiosRequestConfig = {
    url: `/student/${id}`,
    method: 'GET'
  };
  return request<ApiResponse<Student>>(config);
};

// 创建学生
export const createStudent = async (student: Partial<Student>) => {
  const config: AxiosRequestConfig = {
    url: '/student',
    method: 'POST',
    data: student
  };
  return request<ApiResponse<Student>>(config);
};

// 更新学生
export const updateStudent = async (student: Partial<Student>) => {
  const config: AxiosRequestConfig = {
    url: '/student',
    method: 'PUT',
    data: student
  };
  return request<ApiResponse<Student>>(config);
};

// 删除学生
export const deleteStudent = async (id: number) => {
  const config: AxiosRequestConfig = {
    url: `/student/${id}`,
    method: 'DELETE'
  };
  return request<ApiResponse<null>>(config);
}; 