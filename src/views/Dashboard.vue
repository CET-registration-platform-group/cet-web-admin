<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  document.title = '首页 - CET报名管理系统'
})
</script>

<template>
  <div class="app-container dashboard-container">
    <h1>欢迎使用 CET 报名管理系统</h1>
    <p>请使用左侧菜单导航访问各功能模块</p>
    
    <h2>系统主要功能：</h2>
    <ul class="feature-list">
      <li>
        <strong>考试场地管理</strong> - 管理考点、考场和座位信息
      </li>
      <li>
        <strong>考试信息</strong> - 查看和管理考试信息
      </li>
      <li>
        <strong>学生管理</strong> - 管理学生信息和报名状态
      </li>
      <li>
        <strong>报名信息管理</strong> - 查看和管理学生报名信息
      </li>
    </ul>
  </div>
</template>

<style scoped>
.app-container {
  padding: 30px;
  text-align: left;
}

h1 {
  font-size: 24px;
  font-weight: 500;
  color: #333;
  margin-bottom: 15px;
}

h2 {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin: 25px 0 15px 0;
}

p {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.feature-list {
  padding-left: 20px;
  margin-top: 10px;
}

.feature-list li {
  margin-bottom: 12px;
  color: #666;
  font-size: 14px;
}

.feature-list strong {
  color: #333;
}
</style>