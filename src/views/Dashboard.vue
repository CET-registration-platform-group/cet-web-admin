<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { LocationInformation, Box, User, Calendar } from '@element-plus/icons-vue'
import request from '@/api/instance'

interface ExamSite {
  id: number
  name: string
  totalSeats: number
  usedSeats: number
}

interface ExamInfo {
  id: number
  examTime: string
  studentName: string
  examLevel: string
}

interface DashboardData {
  totalExamSites: number
  totalExamSeats: number
  registeredStudents: number
  upcomingExams: number
  examSiteOccupancies: ExamSite[]
  recentExamRegistrations: ExamInfo[]
}

// 数据统计
const stats = ref([
  { id: 1, label: '考点总数', value: 0, icon: Box, color: '#3a7bd5' },
  { id: 2, label: '座位总数', value: 0, icon: LocationInformation, color: '#00d2ff' },
  { id: 3, label: '注册学生数', value: 0, icon: User, color: '#67c23a' },
  { id: 4, label: '即将考试数', value: 0, icon: Calendar, color: '#e6a23c' }
])

// 最近报名记录
const examRegistrations = ref<Array<{
  id: number
  time: string
  studentName: string
  examLevel: string
  examSite: string
  status: string
}>>([])

// 考点座位占用率数据
const examSites = ref<Array<{
  id: number
  name: string
  capacity: number
  occupied: number
  available: number
  status: string
}>>([])

// 获取仪表盘数据
const fetchDashboardData = async () => {
  try {
    const response = await request<{ data: DashboardData }>({
      url: '/api/dashboard',
      method: 'get'
    })
    
    const data = response.data
    
    // 更新统计数据
    stats.value[0].value = data.totalExamSites
    stats.value[1].value = data.totalExamSeats
    stats.value[2].value = data.registeredStudents
    stats.value[3].value = data.upcomingExams
    
    // 更新考点占用率数据
    examSites.value = data.examSiteOccupancies.map((site: ExamSite) => ({
      id: site.id,
      name: site.name,
      capacity: site.totalSeats,
      occupied: site.usedSeats,
      available: site.totalSeats - site.usedSeats,
      status: 'active'
    }))
    
    // 更新最近报名记录
    examRegistrations.value = data.recentExamRegistrations.map((record: ExamInfo) => ({
      id: record.id,
      time: new Date(record.examTime).toLocaleDateString(),
      studentName: record.studentName,
      examLevel: record.examLevel,
      examSite: '待分配',
      status: 'success'
    }))
  } catch (error) {
    console.error('获取仪表盘数据失败:', error)
  }
}

// 刷新数据
const refreshData = () => {
  fetchDashboardData()
}

onMounted(() => {
  document.title = '首页 - CET报名管理系统'
  fetchDashboardData()
})
</script>

<template>
  <div class="app-container dashboard-container">
    <div class="page-header">
      <h1 class="page-title">仪表盘</h1>
      <div class="page-actions">
        <el-button type="primary" @click="refreshData">刷新数据</el-button>
      </div>
    </div>

    <!-- 数据统计卡片 -->
    <div class="stats-container">
      <div class="stats-card" v-for="item in stats" :key="item.id">
        <div class="stats-content">
          <div class="stats-info">
            <div class="stats-label">{{ item.label }}</div>
            <div class="stats-value">{{ item.value }}</div>
            </div>
          <div class="stats-icon" :style="{ backgroundColor: item.color }">
            <el-icon><component :is="item.icon" /></el-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- 考点占用率和最近报名记录 -->
    <div class="main-content">
      <div class="main-section">
        <div class="card exam-site-status">
            <div class="card-header">
            <h3>考点座位占用率</h3>
            <el-button text>查看全部</el-button>
          </div>
          <div class="card-body">
            <div class="exam-sites">
              <div class="exam-site-item" v-for="site in examSites" :key="site.id">
                <div class="site-info">
                  <div class="site-name">
                    {{ site.name }}
                    <el-tag size="small" :type="site.status === 'active' ? 'success' : 'warning'" effect="plain">
                      {{ site.status === 'active' ? '正常' : '维护中' }}
                    </el-tag>
                  </div>
                  <div class="site-status">
                    <span class="site-capacity">{{ site.occupied }}/{{ site.capacity }}</span>
                    <span class="site-available">可用: <b>{{ site.available }}</b></span>
                  </div>
                </div>
                <el-progress 
                  :percentage="Math.round(site.occupied / site.capacity * 100)" 
                  :status="site.occupied / site.capacity > 0.9 ? 'exception' : 
                          site.occupied / site.capacity > 0.7 ? 'warning' : 'success'" 
                  :stroke-width="10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="side-section">
        <div class="card recent-registrations">
            <div class="card-header">
            <h3>最近报名记录</h3>
            <el-button text>查看全部</el-button>
          </div>
          <div class="card-body">
            <el-timeline>
              <el-timeline-item
                v-for="record in examRegistrations"
                :key="record.id"
                :type="record.status"
                :timestamp="record.time"
                :hollow="true"
                size="small"
              >
                <div class="record-content">
                  <h4>{{ record.examLevel }}考试报名</h4>
                  <p>
                    <span class="student-name">{{ record.studentName }}</span>
                    已报名 {{ record.examSite }}
                  </p>
            </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
  padding: 0;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.page-actions {
  display: flex;
  gap: 8px;
}

/* 数据统计卡片样式 */
.stats-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 15px;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
}

.stats-card {
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 0;
  transition: all 0.3s;
  position: relative;
  width: 100%;
  display: block;
  box-sizing: border-box;
  height: 130px; /* 减小高度 */
}

.stats-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stats-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.stats-info {
  flex: 1;
}

.stats-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  font-weight: 500;
}

.stats-value {
  font-size: 36px;
  font-weight: bold;
  color: var(--text-primary);
  line-height: 1;
}

.stats-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin-left: 10px;
}

.stats-icon .el-icon {
  font-size: 28px;
}

/* 主内容区域样式 */
.main-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 15px;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
}

.main-section, .side-section {
  width: 100%;
}

.card {
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  height: 100%;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.card-header {
  padding: 12px 15px;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.card-body {
  padding: 15px;
}

/* 考点占用率 */
.exam-sites {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.exam-site-item {
  padding: 8px 0;
}

.site-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.site-name {
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-wrap: wrap;
  font-size: 14px;
}

.site-status {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-secondary);
  font-size: 13px;
}

.site-capacity {
  font-weight: 500;
}

.site-available {
  font-weight: 500;
}

.site-available b {
  color: var(--success-color);
  font-weight: 600;
}

/* 最近报名记录 */
.record-content h4 {
  font-size: 13px;
  margin: 0 0 4px 0;
  color: var(--text-primary);
}

.record-content p {
  font-size: 12px;
  margin: 0;
  color: var(--text-secondary);
}

.student-name {
  font-weight: 500;
  color: var(--primary-color);
  margin-right: 4px;
}

:deep(.el-progress-bar__outer) {
  border-radius: 4px;
}

:deep(.el-timeline-item__timestamp) {
  font-size: 12px;
}

/* 响应式布局 */
@media (max-width: 1400px) {
  .stats-container {
    gap: 25px;
}

  .main-content {
    gap: 25px;
  }
}

@media (max-width: 1200px) {
  .app-container {
    gap: 25px;
  }
  
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
    margin-bottom: 25px;
    min-height: auto;
  }
  
  .main-content {
    grid-template-columns: 1fr;
    gap: 25px;
  }
  
  .stats-card {
    min-height: 110px;
    padding: 18px;
  }
  
  .stats-content {
    min-height: 75px;
  }
  
  .stats-label {
    font-size: 15px;
    margin-bottom: 10px;
  }
  
  .stats-value {
    font-size: 34px;
  }
  
  .stats-icon {
    width: 65px;
    height: 65px;
    margin-left: 10px;
  }
  
  .stats-icon .el-icon {
    font-size: 32px;
  }
}

@media (max-width: 768px) {
  .app-container {
    gap: 20px;
  }
  
  .stats-container {
    margin-bottom: 20px;
  }
  
  .stats-card {
    min-height: 100px;
    padding: 15px;
  }
  
  .stats-content {
    min-height: 70px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    margin-bottom: 15px;
  }
  
  .page-actions {
    width: 100%;
  }
  
  .page-actions .el-button {
    flex: 1;
  }
  
  .stats-label {
    font-size: 14px;
    margin-bottom: 8px;
  }
  
  .stats-value {
    font-size: 30px;
  }
  
  .stats-icon {
    width: 55px;
    height: 55px;
    border-radius: 12px;
}

  .stats-icon .el-icon {
    font-size: 28px;
  }
  
  .card-header {
    padding: 15px;
  }
  
  .card-body {
    padding: 15px;
  }
}

@media (max-width: 576px) {
  .app-container {
    gap: 15px;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
    gap: 15px;
    margin-bottom: 15px;
  }
  
  .stats-card {
    min-height: 90px;
    padding: 12px;
  }
  
  .stats-content {
    min-height: 60px;
  }
  
  .stats-label {
    font-size: 14px;
    margin-bottom: 6px;
  }
  
  .stats-value {
    font-size: 28px;
  }
  
  .stats-icon {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    margin-left: 10px;
  }
  
  .stats-icon .el-icon {
    font-size: 24px;
  }
}
</style>