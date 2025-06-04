<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useAuth } from '@/hooks'
import { User, Lock, Location, Document, Setting } from '@element-plus/icons-vue'
import type { FormRules, FormInstance } from 'element-plus'
import { LoginParams } from '@/types'
import logoImg from '@/assets/logo.png'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import authUtils from '@/utils/auth'
import { ROUTE_PATHS } from '@/constants/api'
import { login } from '@/api/auth'

console.log('Auth.vue 组件初始化');

const router = useRouter()
const rememberMe = ref(false)

// 使用认证hook
const { loading } = useAuth()

// 登录表单验证
const loginFormRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应为3到20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度应为6到20个字符', trigger: 'blur' }
  ]
}

// 登录表单数据
const loginForm = reactive<LoginParams>({
  username: '',
  password: ''
})

// 表单引用
const loginFormRef = ref<FormInstance>()

// 登录处理
const doLogin = async () => {
  console.log('点击登录按钮，开始执行 doLogin');
  console.log('当前表单数据:', loginForm);
  
  if (!loginFormRef.value) {
    console.log('loginFormRef 未获取到');
    return;
  }
  
  try {
    console.log('准备验证表单');
    await loginFormRef.value.validate();
    console.log('表单验证通过，准备发送登录请求');
    
    try {
      loading.value = true;
      
      console.log('登录参数:', loginForm);
      
      // 使用auth.ts中的login接口
      const response = await login(loginForm);
      
      console.log('登录响应:', response);
      
      if (response.code === 200) {
        ElMessage.success('登录成功');
        
        // 保存token和用户信息
        if (response.data.token) {
          authUtils.setToken(response.data.token, rememberMe.value);
        }
        if (response.data.user) {
          authUtils.setUserInfo(response.data.user, rememberMe.value);
        }
        authUtils.setLoggedIn(true, rememberMe.value);
        
        router.push(ROUTE_PATHS.DASHBOARD);
      } else {
        ElMessage.error(response.message || '登录失败，请检查用户名和密码');
      }
    } catch (error) {
      console.error('登录过程中出错:', error);
      ElMessage.error('登录失败，请稍后重试');
    } finally {
      loading.value = false;
    }
  } catch (error) {
    console.error('表单验证失败:', error);
  }
}

// 在组件挂载时检查登录状态
onMounted(() => {
  console.log('Auth.vue 组件挂载完成');
})
</script>

<template>
  <div class="auth-container">
    <div class="auth-box">
      <div class="form-container">
        <!-- 登录表单 -->
        <div class="form-panel login-panel">
          <div class="form-header">
            <div class="logo-container">
              <img :src="logoImg" alt="CET报名管理系统" class="logo-image" v-if="false">
              <h1 class="logo-text">CET报名管理系统</h1>
            </div>
            <h2>欢迎回来</h2>
            <p>请登录您的账号以继续使用CET报名管理系统</p>
          </div>
          
          <el-form 
            ref="loginFormRef"
            :model="loginForm" 
            :rules="loginFormRules" 
            label-position="top" 
            class="login-form"
          >
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" placeholder="用户名" size="large">
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" placeholder="密码" show-password size="large">
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            
            <div class="form-actions">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              <el-link type="primary">忘记密码?</el-link>
            </div>
            
            <el-button type="primary" :loading="loading" @click="doLogin" class="submit-btn" size="large">登录</el-button>
          </el-form>
        </div>
      </div>
      
      <!-- 装饰性背景 -->
      <div class="decoration-panel">
        <div class="decoration-content login-decoration">
          <div class="decoration-text">
            <div class="decoration-header">
              <h2>欢迎使用CET报名管理系统</h2>
              <p>高效、智能的考试报名管理解决方案</p>
            </div>
            <div class="features">
              <div class="feature-item">
                <div class="icon-container">
                  <el-icon><Location /></el-icon>
                </div>
                <span>多考点集中管理</span>
              </div>
              <div class="feature-item">
                <div class="icon-container">
                  <el-icon><Document /></el-icon>
                </div>
                <span>考场灵活分配</span>
              </div>
              <div class="feature-item">
                <div class="icon-container">
                  <el-icon><Setting /></el-icon>
                </div>
                <span>报名流程管理</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="auth-footer">
      <p>© {{ new Date().getFullYear() }} CET报名管理系统 - 版权所有</p>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #3a7bd5 0%, #9d50bb 100%);
  padding: 20px;
  position: relative;
}

.auth-box {
  width: 900px;
  max-width: 100%;
  height: 600px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  position: relative;
  display: flex;
  margin: 20px 0;
}

.form-container {
  position: relative;
  width: 50%;
  height: 100%;
  overflow: hidden;
}

.form-panel {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  transition: all 0.6s ease-in-out;
  opacity: 0;
  visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;
}

.login-panel {
  left: 0;
  transform: translateX(0);
  opacity: 1;
  visibility: visible;
  z-index: 5;
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo-container {
  margin-bottom: 20px;
}

.logo-image {
  width: 120px;
  height: auto;
}

.logo-text {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.form-header h2 {
  font-size: 24px;
  color: #333;
  margin: 0 0 10px;
}

.form-header p {
  color: #666;
  margin: 0;
}

.login-form {
  width: 100%;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.submit-btn {
  width: 100%;
  margin-top: 10px;
}

.decoration-panel {
  width: 50%;
  height: 100%;
  background: linear-gradient(135deg, #3a7bd5 0%, #9d50bb 100%);
  position: relative;
  overflow: hidden;
}

.decoration-content {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  transition: all 0.6s ease-in-out;
}

.login-decoration {
  left: 0;
  transform: translateX(0);
  opacity: 1;
  visibility: visible;
}

.decoration-text {
  text-align: center;
  max-width: 80%;
}

.decoration-header {
  margin-bottom: 40px;
}

.decoration-header h2 {
  font-size: 28px;
  margin: 0 0 15px;
}

.decoration-header p {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.icon-container {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-container .el-icon {
  font-size: 20px;
}

.feature-item span {
  font-size: 16px;
}

.auth-footer {
  color: #fff;
  text-align: center;
  margin-top: 20px;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .auth-box {
    flex-direction: column;
    height: auto;
  }
  
  .form-container,
  .decoration-panel {
    width: 100%;
  }
  
  .form-container {
    height: 500px;
  }
  
  .decoration-panel {
    height: 300px;
  }
  
  .login-panel {
    transform: translateX(0);
  }
  
  .login-decoration {
    transform: translateX(0);
  }
}
</style> 