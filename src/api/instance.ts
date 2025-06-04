import axios, { AxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';
import authUtils from '@/utils/auth';
import router from '@/router';
import { API_CONFIG, RESPONSE_CODE, ROUTE_PATHS } from '@/constants';

// 创建Axios实例
const instance = axios.create({
  baseURL: API_CONFIG.BASE_URL, // 使用配置的BASE_URL
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 使用认证工具获取token
    const token = authUtils.getToken();
    
    if (token) {
      // 设置Authorization头
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // 如果没有token，确保不发送"Bearer null"
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    const { data } = response;
    
    // 确保返回的数据包含code字段再进行处理
    if (data && 'code' in data) {
      if (data.code === RESPONSE_CODE.SUCCESS) {
        return data;
      } else if (data.code === RESPONSE_CODE.UNAUTHORIZED) {
        // 处理业务层面的未授权（如token过期）
        handleUnauthorized('登录已过期，请重新登录');
        return Promise.reject(new Error(data.message || '登录已过期'));
      } else {
        // 这里不显示错误消息，交给业务代码处理
        return Promise.reject(new Error(data.message || '请求失败'));
      }
    }
    // 不包含code字段的情况，直接返回响应的data
    return data;
  },
  (error) => {
    if (error.response) {
      const { status, config } = error.response;
      
      // 处理HTTP 401未授权错误
      if (status === RESPONSE_CODE.UNAUTHORIZED) {
        // 避免重复处理（如果已经在业务层面处理过）
        if (error.message !== '登录已过期') {
          // 处理未授权情况
          handleUnauthorized('登录已过期，请重新登录');
        }
      } else if (status === RESPONSE_CODE.FORBIDDEN) {
        // 处理403禁止访问
        ElMessage.error('您没有权限访问此资源');
      } else if (status === RESPONSE_CODE.NOT_FOUND) {
        // 处理404资源不存在
        ElMessage.error('请求的资源不存在');
      } else if (status >= 500) {
        // 处理服务器错误
        ElMessage.error('服务器内部错误，请稍后重试');
      } else {
        // 处理其他错误
        ElMessage.error(error.response.data?.message || '请求失败');
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      ElMessage.error('网络连接异常，请检查网络设置');
    } else {
      // 请求配置出错
      ElMessage.error('请求配置错误: ' + (error.message || '未知错误'));
    }
    return Promise.reject(error);
  }
);

// 处理未授权情况的辅助函数
const handleUnauthorized = (message: string) => {
  // 显示错误消息
  try {
    ElMessage.closeAll(); // 关闭所有已有消息
    ElMessage({
      message,
      type: 'error',
      duration: 5000,
      showClose: true
    });
  } catch (err) {
    console.error('显示消息失败:', err);
  }
  
  // 使用认证工具清除登录状态
  authUtils.clearAuth();
  
  // 强制延时确保UI更新
  setTimeout(() => {
    try {
      // 获取当前路由
      const currentPath = router.currentRoute.value.path;
      
      // 如果当前不在登录页，则跳转到登录页
      if (currentPath !== ROUTE_PATHS.AUTH) {
        // 使用replace而不是push，避免用户点击返回按钮时回到需要认证的页面
        router.replace({
          path: ROUTE_PATHS.AUTH,
          // 可以添加查询参数，记录用户之前访问的页面
          query: { redirect: currentPath }
        }).catch(err => {
          console.error('路由跳转失败，尝试强制跳转:', err);
          // 如果路由跳转失败，尝试强制刷新到登录页
          window.location.href = ROUTE_PATHS.AUTH;
        });
      }
    } catch (err) {
      console.error('路由处理失败:', err);
      // 出现错误时强制跳转
      window.location.href = ROUTE_PATHS.AUTH;
    }
  }, 100); // 短暂延时确保UI更新
};

// 添加泛型支持的请求函数
const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return instance(config) as unknown as Promise<T>;
};

export default request; 