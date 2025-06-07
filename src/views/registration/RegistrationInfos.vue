<template>
  <div class="registration-info-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h2>报名信息管理</h2>
          <el-button type="primary" @click="handleAdd">添加报名信息</el-button>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <div class="search-area">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="学生姓名">
            <el-input v-model="searchForm.studentName" placeholder="请输入学生姓名" clearable />
          </el-form-item>
          <el-form-item label="证件号码">
            <el-input v-model="searchForm.identityDocumentNumber" placeholder="请输入证件号码" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 表格区域 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        border
        stripe
      >
        <template #empty>
          <el-empty description="暂无数据" />
        </template>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="studentName" label="学生姓名" min-width="120" />
        <el-table-column prop="studentIdNumber" label="证件号码" min-width="180" />
        <el-table-column prop="currentStep" label="当前步骤" min-width="120">
          <template #default="scope">
            {{ getStepName(scope.row.currentStep) }}
          </template>
        </el-table-column>
        <el-table-column label="已完成步骤" min-width="300">
          <template #default="scope">
            <div class="steps-container">
              <el-tag 
                v-for="step in parseCompletedSteps(scope.row.completedSteps)" 
                :key="step" 
                type="success" 
                effect="plain" 
                size="default"
                style="margin: 2px 5px 2px 0;">
                {{ getStepName(step) }}
              </el-tag>
              <span v-if="parseCompletedSteps(scope.row.completedSteps).length === 0">-</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm
              title="确定删除该报名信息吗？"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
  <div class="pagination-container">
    <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
    </el-card>
    
    <!-- 添加/编辑报名信息对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加报名信息' : '编辑报名信息'"
      width="1200px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="学生" prop="studentId">
          <el-select
            v-model="form.studentId"
            placeholder="请选择学生"
            style="width: 100%"
            filterable
            remote
            :remote-method="remoteSearchStudents"
            :loading="studentLoading"
            :popper-class="'student-select-dropdown'"
          >
            <el-option
              v-for="item in studentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
            <template #footer>
              <div class="select-footer">
                <el-pagination
                  v-model:current-page="studentPage"
                  v-model:page-size="studentPageSize"
                  :total="studentTotal"
                  :page-sizes="[10, 20, 50]"
                  layout="total, sizes, prev, pager, next"
                  @size-change="handleStudentSizeChange"
                  @current-change="handleStudentPageChange"
                />
              </div>
            </template>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="step-flow-container">
          <div class="step-flow-title">报名流程图（按必选/可选顺序）</div>
          
          <div class="flow-diagram-simple">
            <!-- 第一行 主流程 -->
            <div class="flow-node-wrapper">
              <div :class="['flow-node', isStepMandatory('AGREEMENT') ? 'mandatory' : 'optional', 
                          form.currentStep === 'AGREEMENT' ? 'current' : '', 
                          selectedSteps.includes('AGREEMENT') ? 'completed' : '']"
                   @click="handleNodeClick('AGREEMENT')">
                {{ getStepName('AGREEMENT') }}
              </div>
            </div>
            
            <div class="flow-arrow"><el-icon><ArrowRight /></el-icon></div>
            
            <div class="flow-node-wrapper">
              <div :class="['flow-node', isStepMandatory('QUAL_QUERY') ? 'mandatory' : 'optional',
                          form.currentStep === 'QUAL_QUERY' ? 'current' : '', 
                          selectedSteps.includes('QUAL_QUERY') ? 'completed' : '']"
                   @click="handleNodeClick('QUAL_QUERY')">
                {{ getStepName('QUAL_QUERY') }}
              </div>
            </div>
            
            <div class="flow-arrow"><el-icon><ArrowRight /></el-icon></div>
            
            <div class="flow-node-wrapper">
              <div :class="['flow-node', isStepMandatory('QUAL_CONFIRM') ? 'mandatory' : 'optional',
                          form.currentStep === 'QUAL_CONFIRM' ? 'current' : '', 
                          selectedSteps.includes('QUAL_CONFIRM') ? 'completed' : '']"
                   @click="handleNodeClick('QUAL_CONFIRM')">
                {{ getStepName('QUAL_CONFIRM') }}
              </div>
            </div>
            
            <!-- 分支箭头 -->
            <div class="branch-arrows">
              <div class="top-arrow">
                <div class="flow-arrow diag-arrow-top"><el-icon><ArrowRight /></el-icon></div>
              </div>
              <div class="bottom-arrow">
                <div class="flow-arrow diag-arrow-bottom"><el-icon><ArrowRight /></el-icon></div>
              </div>
            </div>
            
            <!-- 分支节点 -->
            <div class="branch-nodes">
              <div class="flow-node-wrapper top-branch">
                <div :class="['flow-node', isStepMandatory('WRITTEN_APPLY') ? 'mandatory' : 'optional',
                            form.currentStep === 'WRITTEN_APPLY' ? 'current' : '', 
                            selectedSteps.includes('WRITTEN_APPLY') ? 'completed' : '']"
                     @click="handleNodeClick('WRITTEN_APPLY')">
                  {{ getStepName('WRITTEN_APPLY') }}
                </div>
              </div>
              
              <div class="flow-node-wrapper bottom-branch">
                <div :class="['flow-node', isStepMandatory('ORAL_APPLY') ? 'mandatory' : 'optional',
                            form.currentStep === 'ORAL_APPLY' ? 'current' : '', 
                            selectedSteps.includes('ORAL_APPLY') ? 'completed' : '']"
                     @click="handleNodeClick('ORAL_APPLY')">
                  {{ getStepName('ORAL_APPLY') }}
                </div>
              </div>
            </div>
            
            <!-- 分支箭头 -->
            <div class="branch-arrows">
              <div class="top-arrow">
                <div class="flow-arrow"><el-icon><ArrowRight /></el-icon></div>
              </div>
              <div class="bottom-arrow">
                <div class="flow-arrow"><el-icon><ArrowRight /></el-icon></div>
              </div>
            </div>
            
            <!-- 分支节点2 -->
            <div class="branch-nodes">
              <div class="flow-node-wrapper top-branch">
                <div :class="['flow-node', isStepMandatory('WRITTEN_PAY') ? 'mandatory' : 'optional',
                            form.currentStep === 'WRITTEN_PAY' ? 'current' : '', 
                            selectedSteps.includes('WRITTEN_PAY') ? 'completed' : '']"
                     @click="handleNodeClick('WRITTEN_PAY')">
                  {{ getStepName('WRITTEN_PAY') }}
                </div>
              </div>
              
              <div class="flow-node-wrapper bottom-branch">
                <div :class="['flow-node', isStepMandatory('ORAL_PAY') ? 'mandatory' : 'optional',
                            form.currentStep === 'ORAL_PAY' ? 'current' : '', 
                            selectedSteps.includes('ORAL_PAY') ? 'completed' : '']"
                     @click="handleNodeClick('ORAL_PAY')">
                  {{ getStepName('ORAL_PAY') }}
                </div>
              </div>
            </div>
            
            <!-- 合并箭头 -->
            <div class="branch-arrows">
              <div class="top-arrow">
                <div class="flow-arrow diag-arrow-bottom"><el-icon><ArrowRight /></el-icon></div>
              </div>
              <div class="bottom-arrow">
                <div class="flow-arrow diag-arrow-top"><el-icon><ArrowRight /></el-icon></div>
              </div>
            </div>
            
            <!-- 合并后的流程 -->
            <div class="flow-node-wrapper">
              <div :class="['flow-node', isStepMandatory('COMPLETE') ? 'mandatory' : 'optional',
                          form.currentStep === 'COMPLETE' ? 'current' : '', 
                          selectedSteps.includes('COMPLETE') ? 'completed' : '']"
                   @click="handleNodeClick('COMPLETE')">
                {{ getStepName('COMPLETE') }}
              </div>
            </div>
            
            <div class="flow-arrow"><el-icon><ArrowRight /></el-icon></div>
            
            <div class="flow-node-wrapper">
              <div :class="['flow-node', isStepMandatory('PRINT_ADMIT') ? 'mandatory' : 'optional',
                          form.currentStep === 'PRINT_ADMIT' ? 'current' : '', 
                          selectedSteps.includes('PRINT_ADMIT') ? 'completed' : '']"
                   @click="handleNodeClick('PRINT_ADMIT')">
                {{ getStepName('PRINT_ADMIT') }}
              </div>
            </div>
          </div>
          
          <div class="step-legend">
            <div class="legend-item"><span class="legend-mark mandatory"></span>必选步骤</div>
            <div class="legend-item"><span class="legend-mark optional"></span>可选步骤</div>
            <div class="legend-item"><span class="legend-mark current"></span>当前步骤</div>
            <div class="legend-item"><span class="legend-mark completed"></span>已完成步骤</div>
          </div>
        </div>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
import { getRegistrationInfoList, createRegistrationInfo, updateRegistrationInfo, deleteRegistrationInfo } from '@/api/registration';
import { getStudentList, getStudentDetail } from '@/api/student';
import { RegistrationInfo } from '@/types/registration-info';
import {
  ArrowRight
} from '@element-plus/icons-vue'

// 表格数据
const tableData = ref<any[]>([]);
const loading = ref(false);

// 分页
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 搜索表单
const searchForm = reactive({
  studentName: '',
  identityDocumentNumber: ''
});

// 添加/编辑表单
const formRef = ref<FormInstance>();
const form = reactive<Partial<RegistrationInfo>>({
  studentId: undefined,
  currentStep: '',
  completedSteps: ''
});

// 选中的步骤数组
const selectedSteps = ref<string[]>([]);

// 表单验证规则
const rules = {
  studentId: [{ required: true, message: '请选择学生', trigger: 'change' }]
};

// 对话框控制
const dialogVisible = ref(false);
const dialogType = ref<'add' | 'edit'>('add');

// 学生选项
const studentOptions = ref<{ value: number; label: string }[]>([]);
const studentLoading = ref(false);
const studentPage = ref(1);
const studentPageSize = ref(10);
const studentTotal = ref(0);

// 步骤选项
const stepOptions = [
  { value: 'AGREEMENT', label: '报名协议' },
  { value: 'QUAL_QUERY', label: '资格信息查询' },
  { value: 'QUAL_CONFIRM', label: '资格信息确认' },
  { value: 'WRITTEN_APPLY', label: '笔试报考' },
  { value: 'WRITTEN_PAY', label: '笔试缴费' },
  { value: 'ORAL_APPLY', label: '口试报考' },
  { value: 'ORAL_PAY', label: '口试缴费' },
  { value: 'COMPLETE', label: '完成报名' },
  { value: 'PRINT_ADMIT', label: '打印笔试准考证' }
];

// 步骤流程图配置
const stepFlow = {
  'AGREEMENT': ['QUAL_QUERY'],
  'QUAL_QUERY': ['QUAL_CONFIRM'],
  'QUAL_CONFIRM': ['WRITTEN_APPLY'],
  'WRITTEN_APPLY': ['WRITTEN_PAY'],
  'WRITTEN_PAY': ['ORAL_APPLY', 'COMPLETE'],
  'ORAL_APPLY': ['ORAL_PAY'],
  'ORAL_PAY': ['COMPLETE'],
  'COMPLETE': ['PRINT_ADMIT']
};

// 必选步骤
const mandatorySteps = [
  'AGREEMENT', 'QUAL_QUERY', 'QUAL_CONFIRM', 'WRITTEN_APPLY', 
  'WRITTEN_PAY', 'COMPLETE', 'PRINT_ADMIT'
];

// 获取步骤是否必选
const isStepMandatory = (step: string) => {
  return mandatorySteps.includes(step);
};

// 解析已完成步骤字符串为数组
const parseCompletedSteps = (completedStepsStr: string) => {
  if (!completedStepsStr) return [];
  try {
    return JSON.parse(completedStepsStr);
  } catch (e) {
    return [];
  }
};

// 获取步骤名称
const getStepName = (stepValue: string) => {
  const step = stepOptions.find(s => s.value === stepValue);
  return step ? step.label : stepValue;
};

// 处理已完成步骤变化
const handleStepsChange = (value: string[]) => {
  form.completedSteps = JSON.stringify(value);
};

// 远程搜索学生
const remoteSearchStudents = async (query: string) => {
  studentLoading.value = true;
  try {
    const params = {
      pageNum: studentPage.value,
      pageSize: studentPageSize.value,
      name: query
    };
    
    const res = await getStudentList(params);
    if (res.code === 200) {
      const studentList = Array.isArray(res.data) ? res.data : 
                         res.data.records || [];
      studentOptions.value = studentList.map((student: any) => ({
        value: student.id,
        label: `${student.name} (${student.identityDocumentNumber || ''})`
      }));
      studentTotal.value = res.data.total || 0;
    }
  } catch (error) {
    console.error('搜索学生出错:', error);
  } finally {
    studentLoading.value = false;
  }
};

// 学生分页处理
const handleStudentSizeChange = (size: number) => {
  studentPageSize.value = size;
  remoteSearchStudents('');
};

const handleStudentPageChange = (page: number) => {
  studentPage.value = page;
  remoteSearchStudents('');
};

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      studentName: searchForm.studentName,
      identityDocumentNumber: searchForm.identityDocumentNumber
    };
    
    console.log('查询参数:', params); // 调试用
    
    const res = await getRegistrationInfoList(params);
    if (res.code === 200) {
      const records = res.data.records || [];
      // 获取学生姓名和证件号码
      const enrichedRecords = await Promise.all(records.map(async (record: any) => {
        if (record.studentId) {
          try {
            const studentRes = await getStudentDetail(record.studentId);
            if (studentRes.code === 200 && studentRes.data) {
              record.studentName = studentRes.data.name;
              record.studentIdNumber = studentRes.data.identityDocumentNumber;
            }
          } catch (error) {
            console.error('获取学生信息出错:', error);
          }
        }
        return record;
      }));
      
      tableData.value = enrichedRecords;
      total.value = res.data.total || 0;
    } else {
      if (res.message) ElMessage.error(res.message);
    }
  } catch (error) {
    console.error('加载数据出错:', error);
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  currentPage.value = 1;
  loadData();
};

// 重置搜索
const resetSearch = () => {
  searchForm.studentName = '';
  searchForm.identityDocumentNumber = '';
  currentPage.value = 1;
  loadData();
};

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  loadData();
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  loadData();
};

// 添加报名信息
const handleAdd = () => {
  dialogType.value = 'add';
  form.id = undefined;
  form.studentId = undefined;
  form.currentStep = '';
  form.completedSteps = '';
  selectedSteps.value = [];
  dialogVisible.value = true;
};

// 编辑报名信息
const handleEdit = (row: any) => {
  dialogType.value = 'edit';
  form.id = row.id;
  form.studentId = row.studentId;
  form.currentStep = row.currentStep;
  form.completedSteps = row.completedSteps;
  
  // 解析已完成步骤
  selectedSteps.value = parseCompletedSteps(row.completedSteps);
  
  // 如果学生不在选项中，添加到选项
  if (row.studentId && row.studentName && !studentOptions.value.some(opt => opt.value === row.studentId)) {
    studentOptions.value.push({
      value: row.studentId,
      label: `${row.studentName} (${row.studentIdNumber || ''})`
    });
  }
  
  dialogVisible.value = true;
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const submitData = { ...form } as any;
        if (dialogType.value === 'add') {
          const res = await createRegistrationInfo(submitData);
          if (res.code === 200) {
            if (res.message) ElMessage.success(res.message);
            dialogVisible.value = false;
            loadData();
          } else {
            if (res.message) ElMessage.error(res.message);
          }
        } else {
          const res = await updateRegistrationInfo(submitData);
          if (res.code === 200) {
            if (res.message) ElMessage.success(res.message);
            dialogVisible.value = false;
            loadData();
          } else {
            if (res.message) ElMessage.error(res.message);
          }
        }
      } catch (error) {
        console.error('提交表单出错:', error);
      }
    }
  });
};

// 删除报名信息
const handleDelete = async (id: number) => {
  try {
    const res = await deleteRegistrationInfo(id);
    if (res.code === 200) {
      if (res.message) ElMessage.success(res.message);
      if (tableData.value.length === 1 && currentPage.value > 1) {
        currentPage.value--;
      }
      loadData();
    } else {
      if (res.message) ElMessage.error(res.message);
    }
  } catch (error) {
    console.error('删除报名信息出错:', error);
  }
};

// 修改handleNodeClick函数，实现顺序完成和逆序取消
const handleNodeClick = (step: string) => {
  // 获取步骤顺序和索引
  const allSteps = stepOptions.map(s => s.value);
  const stepIndex = allSteps.indexOf(step);
  const currentStepIndex = form.currentStep ? allSteps.indexOf(form.currentStep) : -1;
  
  // 检查该步骤是否已完成
  const isCompleted = selectedSteps.value.includes(step);
  
  if (isCompleted) {
    // 如果步骤已完成，检查是否可以取消
    // 只能取消最后一个完成的步骤
    if (step !== form.currentStep) {
      const currentStepName = form.currentStep ? getStepName(form.currentStep) : '';
      ElMessage.warning(`只能取消最后完成的步骤：${currentStepName}`);
      return;
    }
    
    // 确认取消该步骤
    ElMessageBox.confirm(
      `确定要取消"${getStepName(step)}"步骤吗？`,
      '取消步骤',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    .then(() => {
      // 从已完成步骤中移除
      const index = selectedSteps.value.indexOf(step);
      if (index !== -1) {
        selectedSteps.value.splice(index, 1);
        
        // 更新completedSteps字符串
        handleStepsChange(selectedSteps.value);
        
        // 找到前一个步骤并设为当前步骤
        if (selectedSteps.value.length > 0) {
          // 如果还有已完成步骤，将最后一个设为当前步骤
          form.currentStep = selectedSteps.value[selectedSteps.value.length - 1];
        } else {
          // 如果没有已完成步骤，清空当前步骤
          form.currentStep = '';
        }
        
        ElMessage.success(`成功取消"${getStepName(step)}"步骤`);
      }
    })
    .catch(() => {
      // 用户取消，不做任何操作
    });
  } else {
    // 如果步骤未完成，检查是否可以完成
    // 检查是否按顺序完成
    // 如果没有完成的步骤，只能完成第一个步骤
    if (selectedSteps.value.length === 0 && stepIndex !== 0) {
      ElMessage.warning(`请先完成第一个步骤：${getStepName(allSteps[0])}`);
      return;
    }
    
    // 如果有完成的步骤，只能完成下一个步骤
    const nextStep = form.currentStep ? getNextStep(form.currentStep) : 'AGREEMENT';
    const allowedNextSteps = nextStep.split(','); // 处理可能有多个下一步的情况
    
    if (selectedSteps.value.length > 0 && !allowedNextSteps.includes(step)) {
      // 对于笔试缴费后的特殊处理
      if (form.currentStep === 'WRITTEN_PAY') {
        ElMessage.warning(`笔试缴费后，可以选择"${getStepName('ORAL_APPLY')}"或直接"${getStepName('COMPLETE')}"`);
      } else {
        ElMessage.warning(`请按顺序完成步骤，下一步应为：${allowedNextSteps.map(s => getStepName(s)).join('或')}`);
      }
      return;
    }
    
    // 确认完成该步骤
    ElMessageBox.confirm(
      `确定要完成"${getStepName(step)}"步骤吗？`,
      '完成步骤',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      }
    )
    .then(() => {
      // 将该步骤设为当前步骤（表示最后完成的步骤）
      form.currentStep = step;
      
      // 确保该步骤在已完成步骤列表中
      if (!selectedSteps.value.includes(step)) {
        selectedSteps.value.push(step);
        // 更新completedSteps字符串
        handleStepsChange(selectedSteps.value);
      }
      
      ElMessage.success(`成功完成"${getStepName(step)}"步骤`);
    })
    .catch(() => {
      // 用户取消，不做任何操作
    });
  }
};

// 修改getNextStep函数
const getNextStep = (currentStep: string): string => {
  // 使用stepFlow映射关系
  if (!currentStep) {
    return 'AGREEMENT'; // 如果没有当前步骤，返回第一个步骤
  }
  
  // 检查当前步骤是否在stepFlow中
  if (!(currentStep in stepFlow)) {
    return 'AGREEMENT';
  }
  
  // 口试步骤和笔试步骤的特殊处理
  if (currentStep === 'WRITTEN_PAY') {
    // 笔试缴费后可以选择口试报考或直接完成报名
    return 'ORAL_APPLY,COMPLETE'; // 返回多个可选步骤，用逗号分隔
  } else if (currentStep === 'ORAL_PAY') {
    // 口试缴费后是完成报名
    return 'COMPLETE';
  } else {
    // 其他情况，返回stepFlow中定义的第一个后续步骤
    const nextSteps = stepFlow[currentStep as keyof typeof stepFlow];
    return nextSteps[0];
  }
};

// 初始化
onMounted(() => {
  loadData();
});
</script> 

<style scoped>
.registration-info-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-area {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.select-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-top: 1px solid #ebeef5;
}

:deep(.student-select-dropdown) {
  .el-select-dropdown__wrap {
    max-height: 300px;
  }
  
  .select-footer {
    position: sticky;
    bottom: 0;
    background: #fff;
    z-index: 1;
  }
}

.steps-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
}

.selected-steps {
  margin-top: 8px;
  padding: 5px;
  border: 1px dashed #e6e6e6;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.step-flow-container {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.step-flow-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #303133;
  text-align: center;
}

.flow-diagram-simple {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  padding: 25px 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
  justify-content: center;
  position: relative;
  width: 95%;
  margin-left: auto;
  margin-right: auto;
}

.flow-node-wrapper {
  display: flex;
  justify-content: center;
}

.branch-nodes {
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
}

.branch-arrows {
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
}

.top-branch, .bottom-branch {
  height: 32px;
  display: flex;
  align-items: center;
}

.diag-arrow-top {
  transform: rotate(-30deg);
}

.diag-arrow-bottom {
  transform: rotate(30deg);
}

.flow-node {
  min-width: 82px;
  padding: 6px 8px;
  border-radius: 4px;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.flow-node:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.flow-node.mandatory {
  background-color: #f0f9eb;
  color: #67c23a;
  border: 1px solid #c2e7b0;
}

.flow-node.optional {
  background-color: #fdf6ec;
  color: #e6a23c;
  border: 1px solid #f5dab1;
}

.flow-node.current {
  background-color: #409eff;
  color: white;
  border: 1px solid #409eff;
}

.flow-node.current:after {
  content: '当前';
  position: absolute;
  top: -15px;
  right: -5px;
  font-size: 10px;
  background-color: #409eff;
  color: white;
  padding: 1px 4px;
  border-radius: 2px;
  font-weight: normal;
}

.flow-node.completed {
  background-color: #67c23a;
  color: white;
  border: 1px solid #67c23a;
}

.flow-arrow {
  margin: 0 8px;
  color: #909399;
  display: flex;
  align-items: center;
  font-size: 13px;
}

.step-legend {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin: 0 8px;
  font-size: 12px;
}

.legend-mark {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  margin-right: 4px;
}

.legend-mark.mandatory {
  background-color: #f0f9eb;
  border: 1px solid #c2e7b0;
}

.legend-mark.optional {
  background-color: #fdf6ec;
  border: 1px solid #f5dab1;
}

.legend-mark.current {
  background-color: #409eff;
  border: 1px solid #409eff;
}

.legend-mark.completed {
  background-color: #67c23a;
  border: 1px solid #67c23a;
}
</style> 