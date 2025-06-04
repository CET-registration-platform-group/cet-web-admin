<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStatistics } from '@/hooks';
import { Odometer, Box, LocationInformation, Refresh, Calendar, User } from '@element-plus/icons-vue';

// 使用统计数据hook
const {
  loading,
  dateRange,
  totalExamSites,
  totalExamSeats,
  registeredStudents,
  assignedSeats,
  upcomingExams,
  cet4Count,
  cet6Count,
  examSiteUtilization,
  examTypeDistribution,
  dailyRegistrations,
  examLevelDistribution,
  loadAllData,
  updateDateRange
} = useStatistics();

// 当前选择的分析类型
const activeTab = ref('overview');

// 选择日期范围
const handleDateChange = (val: [Date, Date]) => {
  if (val) {
    updateDateRange(val);
  }
};

// 刷新数据
const handleRefresh = () => {
  loadAllData();
};

onMounted(() => {
  document.title = '数据分析 - CET报名管理系统';
});
</script>

<template>
  <div class="data-analysis-container">
    <!-- 分析标签页 -->
    <el-card class="analysis-card">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="报名分析" name="registrations">
          <div v-if="loading" class="loading-container">
            <el-skeleton :rows="5" animated />
          </div>
          <div v-else>
            <div class="income-overview">
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="income-item">
                    <div class="income-title">四级报名人数</div>
                    <div class="income-value primary">{{ cet4Count }}</div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="income-item">
                    <div class="income-title">六级报名人数</div>
                    <div class="income-value warning">{{ cet6Count }}</div>
                  </div>
                </el-col>
              </el-row>
            </div>
            
            <div class="income-chart-section">
              <h3 class="section-title">
                <el-icon><Calendar /></el-icon>
                <span>日报名趋势</span>
              </h3>
              <div class="chart-container">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>日期</th>
                      <th>报名人数</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in dailyRegistrations" :key="item.date">
                      <td>{{ item.date }}</td>
                      <td>{{ item.count }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="考点分析" name="utilization">
          <div v-if="loading" class="loading-container">
            <el-skeleton :rows="5" animated />
          </div>
          <div v-else>
            <div class="utilization-section">
              <h3 class="section-title">
                <el-icon><Box /></el-icon>
                <span>考点座位利用率</span>
              </h3>
              <div class="chart-container">
                <el-table :data="examSiteUtilization" border stripe>
                  <el-table-column label="考点名称" prop="name" min-width="180" />
                  <el-table-column label="总座位数" prop="total" width="100" />
                  <el-table-column label="已分配" prop="occupied" width="100" />
                  <el-table-column label="利用率" width="200">
                    <template #default="{ row }">
                      <div class="utilization-bar">
                        <el-progress 
                          :percentage="row.utilization" 
                          :status="row.utilization > 80 ? 'exception' : 
                                   row.utilization > 60 ? 'warning' : 'success'" 
                          :stroke-width="15"
                          :format="(p: number) => p + '%'"
                        />
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            
            <div class="hourly-distribution-section">
              <h3 class="section-title">
                <el-icon><Odometer /></el-icon>
                <span>考试类型分布</span>
              </h3>
              <div class="chart-container">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>考试类型</th>
                      <th>考试数量</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in examTypeDistribution" :key="item.type">
                      <td>{{ item.type }}</td>
                      <td>{{ item.count }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="考试分析" name="exams">
          <div v-if="loading" class="loading-container">
            <el-skeleton :rows="5" animated />
          </div>
          <div v-else>
            <div class="spots-section">
              <h3 class="section-title">
                <el-icon><LocationInformation /></el-icon>
                <span>考试级别分布</span>
              </h3>
              <div class="chart-container">
                <el-table :data="examLevelDistribution" border stripe>
                  <el-table-column label="考试级别" prop="level" min-width="180" />
                  <el-table-column label="考试数量" prop="count" width="120" />
                  <el-table-column label="占比" width="200">
                    <template #default="{ row }">
                      <div class="utilization-bar">
                        <el-progress 
                          :percentage="row.percentage" 
                          :stroke-width="15"
                          :format="(p: number) => p + '%'"
                        />
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<style scoped>
.data-analysis-container {
  padding: 10px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.page-actions {
  display: flex;
  gap: 10px;
}

.analysis-card {
  margin-top: 0;
}

.loading-container {
  padding: 10px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 15px;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.section-title .el-icon {
  margin-right: 6px;
  color: var(--primary-color);
}

.chart-container {
  margin-bottom: 20px;
}

.income-overview {
  background-color: var(--background-light);
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
}

.income-item {
  text-align: center;
}

.income-title {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.income-value {
  font-size: 22px;
  font-weight: 600;
}

.income-value.primary {
  color: var(--primary-color);
}

.income-value.warning {
  color: var(--warning-color);
}

.income-chart-section,
.utilization-section,
.hourly-distribution-section,
.spots-section {
  margin-top: 15px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid var(--border-light);
}

.data-table th {
  background-color: var(--background-light);
  font-weight: 600;
  color: var(--text-primary);
}

.data-table tr:hover {
  background-color: var(--background-hover);
}

.utilization-bar {
  width: 100%;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .page-actions {
    width: 100%;
    flex-wrap: wrap;
  }
  
  .page-actions .el-date-picker {
    width: 100%;
  }
  
  .page-actions .el-button {
    width: 100%;
  }
}
</style> 