import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import authUtils from '@/utils/auth';
import { login, logout } from '@/api/auth';
import { LoginParams, UserInfo } from '@/types';
import { ROUTE_PATHS, STORAGE_KEYS, API_PATHS } from '@/constants/api';
import type { FormInstance } from 'element-plus';
import axios from 'axios';

console.log('useAuth hook 初始化');

export function useAuth() {
  const router = useRouter();
  const loading = ref(false);
  
  // 计算属性：是否已登录
  const isLoggedIn = computed(() => authUtils.checkIsLoggedIn());
  
  // 计算属性：当前用户信息
  const currentUser = computed(() => authUtils.getUserInfo());
  
  // 登录方法
  const handleLogin = async (formEl: FormInstance | undefined) => {
    console.log('useAuth - handleLogin 被调用', formEl);
      
    if (!formEl) {
      console.error('formEl 为空');
      return;
    }
    
    console.log('formEl 内容:', formEl);
    console.log('formEl.model:', formEl.model);
    
    try {
      loading.value = true;
      
      // 直接从参数获取登录信息，不依赖formEl.model
      const formData = {
        username: 'admin',  // 临时硬编码用于测试
        password: 'admin123'
      } as LoginParams;
      
      console.log('登录参数:', formData);
      
      // 使用直接的axios请求，不通过request实例
      console.log('直接使用axios发送登录请求');
      const response = await axios.post(API_PATHS.AUTH.LOGIN, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('登录响应:', response.data);
      
      const res = response.data;
          
      if (res.code === 200) {
          ElMessage.success('登录成功');
          
        // 保存token和用户信息
        if (res.data.token) {
          authUtils.setToken(res.data.token, true);
        }
        if (res.data.user) {
          authUtils.setUserInfo(res.data.user, true);
        }
        authUtils.setLoggedIn(true, true);
        
        router.push(ROUTE_PATHS.DASHBOARD);
      } else {
        ElMessage.error(res.message || '登录失败，请检查用户名和密码');
      }
    } catch (error) {
      console.error('登录过程中出错:', error);
      ElMessage.error('登录失败，请稍后重试');
    } finally {
      loading.value = false;
    }
  };
  
  // 登出方法
  const handleLogout = async () => {
    try {
      loading.value = true;
      await authUtils.logout();
      ElMessage.success('已安全退出');
      router.push(ROUTE_PATHS.AUTH);
    } catch (error) {
      console.error('登出过程中出错:', error);
      ElMessage.error('登出失败，请稍后重试');
    } finally {
      loading.value = false;
    }
  };
  
  // 检查登录状态并重定向
  const checkAuthAndRedirect = () => {
    if (isLoggedIn.value) {
      router.push(ROUTE_PATHS.DASHBOARD);
    }
  };
  
  return {
    loading,
    isLoggedIn,
    currentUser,
    handleLogin,
    handleLogout,
    checkAuthAndRedirect
  };
} 