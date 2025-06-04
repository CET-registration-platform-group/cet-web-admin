import request from './instance';
import { API_PATHS } from '@/constants/api';
import type { Student, StudentQueryParams, StudentListResponse, StudentDetailResponse, CommonResponse } from '@/types/student';

// 获取学生列表
export const getStudentList = (params: StudentQueryParams) => {
  return request<StudentListResponse>({
    url: API_PATHS.ADMIN.STUDENTS.LIST,
    method: 'GET',
    params
  });
};

// 创建学生
export const createStudent = (data: Student) => {
  return request<CommonResponse>({
    url: API_PATHS.ADMIN.STUDENTS.CREATE,
    method: 'POST',
    data
  });
};

// 更新学生
export const updateStudent = (data: Student) => {
  return request<CommonResponse>({
    url: API_PATHS.ADMIN.STUDENTS.UPDATE,
    method: 'PUT',
    data
  });
};

// 删除学生
export const deleteStudent = (id: number) => {
  return request<CommonResponse>({
    url: API_PATHS.ADMIN.STUDENTS.DELETE(id),
    method: 'DELETE'
  });
};

// 获取学生详情
export const getStudentDetail = (id: number) => {
  return request<StudentDetailResponse>({
    url: API_PATHS.ADMIN.STUDENTS.DETAIL(id),
    method: 'GET'
  });
}; 