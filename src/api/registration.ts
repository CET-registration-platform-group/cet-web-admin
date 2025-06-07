import request from '@/utils/request';
import { API_PATHS } from '@/constants/api';
import { RegistrationInfo, RegistrationInfoQueryParams } from '@/types/registration-info';

/**
 * 获取报名信息列表
 * @param params 查询参数
 */
export const getRegistrationInfoList = (params: RegistrationInfoQueryParams) => {
  console.log('发送请求参数:', params); // 调试用
  return request.get(API_PATHS.ADMIN.REGISTRATION.LIST, { params });
};

/**
 * 获取报名信息详情
 * @param id 报名信息ID
 */
export const getRegistrationInfoDetail = (id: number) => {
  return request.get(API_PATHS.ADMIN.REGISTRATION.DETAIL(id));
};

/**
 * 创建报名信息
 * @param data 报名信息数据
 */
export const createRegistrationInfo = (data: RegistrationInfo) => {
  return request.post(API_PATHS.ADMIN.REGISTRATION.CREATE, data);
};

/**
 * 更新报名信息
 * @param data 报名信息数据
 */
export const updateRegistrationInfo = (data: RegistrationInfo) => {
  return request.put(API_PATHS.ADMIN.REGISTRATION.UPDATE, data);
};

/**
 * 删除报名信息
 * @param id 报名信息ID
 */
export const deleteRegistrationInfo = (id: number) => {
  return request.delete(API_PATHS.ADMIN.REGISTRATION.DELETE(id));
};

/**
 * 重置报名步骤
 * @param studentId 学生ID
 */
export const resetRegistrationStep = (studentId: number) => {
  return request.post(API_PATHS.ADMIN.REGISTRATION.RESET(studentId));
}; 