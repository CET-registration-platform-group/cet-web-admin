<template>
  <div class="exam-info-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h2>考试信息管理</h2>
          <el-button type="primary" @click="handleAdd">添加考试信息</el-button>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <div class="search-area">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="学生">
            <el-select v-model="searchForm.studentId" placeholder="选择学生" clearable filterable remote :remote-method="remoteSearchStudents" :loading="studentLoading">
              <el-option
                v-for="item in studentOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="座位">
            <el-select v-model="searchForm.examSeatId" placeholder="选择座位" clearable style="width: 200px">
              <el-option
                v-for="item in seatOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="考试类型">
            <el-select v-model="searchForm.examType" placeholder="选择类型" clearable style="width: 200px">
              <el-option label="笔试" value="笔试" />
              <el-option label="口试" value="口试" />
            </el-select>
          </el-form-item>
          <el-form-item label="考试级别">
            <el-select v-model="searchForm.examLevel" placeholder="选择级别" clearable style="width: 200px">
              <el-option label="四级" value="四级" />
              <el-option label="六级" value="六级" />
            </el-select>
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
        v-bind="$attrs"
      >
        <template #empty>
          <el-empty description="暂无数据" />
        </template>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="studentName" label="学生姓名" min-width="120" />
        <el-table-column prop="seatNumber" label="座位号" min-width="120" />
        <el-table-column prop="roomNumber" label="考场号" min-width="120" />
        <el-table-column prop="examSiteName" label="考点" min-width="180" />
        <el-table-column prop="examTime" label="考试时间" min-width="180" />
        <el-table-column prop="examType" label="考试类型" width="100" />
        <el-table-column prop="examLevel" label="考试级别" width="100" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm
              title="确定删除该考试信息吗？"
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
          :background="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 添加/编辑考试信息对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加考试信息' : '编辑考试信息'"
      width="500px"
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
        <el-form-item label="座位" prop="examSeatId">
          <el-select
            v-model="form.examSeatId"
            placeholder="请选择座位"
            style="width: 100%"
            filterable
            remote
            :remote-method="remoteSearchSeats"
            :loading="seatLoading"
            :popper-class="'seat-select-dropdown'"
          >
            <el-option
              v-for="item in seatOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
            <template #footer>
              <div class="select-footer">
                <el-pagination
                  v-model:current-page="seatPage"
                  v-model:page-size="seatPageSize"
                  :total="seatTotal"
                  :page-sizes="[10, 20, 50]"
                  layout="total, sizes, prev, pager, next"
                  @size-change="handleSeatSizeChange"
                  @current-change="handleSeatPageChange"
                />
              </div>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="考试时间" prop="examTime">
          <el-date-picker
            v-model="form.examTime"
            type="datetime"
            placeholder="选择考试时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="考试类型" prop="examType">
          <el-select v-model="form.examType" placeholder="请选择考试类型" style="width: 100%">
            <el-option label="笔试" value="笔试" />
            <el-option label="口试" value="口试" />
          </el-select>
        </el-form-item>
        <el-form-item label="考试级别" prop="examLevel">
          <el-select v-model="form.examLevel" placeholder="请选择考试级别" style="width: 100%">
            <el-option label="四级" value="四级" />
            <el-option label="六级" value="六级" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
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
import { ElMessage, FormInstance } from 'element-plus';
import { ExamInfo, ExamSeat, Student } from '@/types';
import { getExamInfoList, createExamInfo, updateExamInfo, deleteExamInfo } from '@/api/examInfo';
import { getExamSeatList, getExamSeatDetail } from '@/api/examSeat';
import { getStudentList, getStudentDetail } from '@/api/student';
import { getExamSiteList } from '@/api/examSite';

// 表格数据
const tableData = ref<ExamInfo[]>([]);
const loading = ref(false);

// 分页
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 学生选项
const studentOptions = ref<{ value: number; label: string }[]>([]);
const studentLoading = ref(false);

// 座位选项
const seatOptions = ref<{ value: number; label: string }[]>([]);

// 搜索表单
const searchForm = reactive({
  studentId: undefined as number | undefined,
  examSeatId: undefined as number | undefined,
  examType: undefined as string | undefined,
  examLevel: undefined as string | undefined
});

// 添加/编辑表单
const formRef = ref<FormInstance>();
const form = reactive<Partial<ExamInfo>>({
  studentId: undefined,
  examSeatId: undefined,
  examTime: '',
  examType: '',
  examLevel: ''
});

// 表单验证规则
const rules = {
  studentId: [{ required: true, message: '请选择学生', trigger: 'change' }],
  examSeatId: [{ required: true, message: '请选择座位', trigger: 'change' }],
  examTime: [{ required: true, message: '请选择考试时间', trigger: 'change' }],
  examType: [{ required: true, message: '请选择考试类型', trigger: 'change' }],
  examLevel: [{ required: true, message: '请选择考试级别', trigger: 'change' }]
};

// 对话框控制
const dialogVisible = ref(false);
const dialogType = ref<'add' | 'edit'>('add');

// 学生选择分页
const studentPage = ref(1);
const studentPageSize = ref(10);
const studentTotal = ref(0);

// 座位选择分页
const seatPage = ref(1);
const seatPageSize = ref(10);
const seatTotal = ref(0);
const seatLoading = ref(false);

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
      studentOptions.value = (studentList as any[]).map((student: any) => ({
        value: student.id,
        label: `${student.name} (${student.identityDocumentNumber})`
      }));
      studentTotal.value = res.data.total || studentList.length;
    }
  } catch (error) {
    console.error('搜索学生出错:', error);
  } finally {
    studentLoading.value = false;
  }
};

// 远程搜索座位
const remoteSearchSeats = async (query: string) => {
  seatLoading.value = true;
  try {
    const params = {
      pageNum: seatPage.value,
      pageSize: seatPageSize.value,
      seatNumber: query
    };
    
    const res = await getExamSeatList(params);
    if (res.code === 200) {
      const seatList = Array.isArray(res.data) ? res.data : 
                      res.data.records || [];
      seatOptions.value = (seatList as any[]).map((seat: any) => ({
        value: seat.id,
        label: seat.examRoomNumber ? `${seat.seatNumber} (${seat.examRoomNumber})` : seat.seatNumber
      }));
      seatTotal.value = res.data.total || seatList.length;
    }
  } catch (error) {
    console.error('搜索座位出错:', error);
  } finally {
    seatLoading.value = false;
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

// 座位分页处理
const handleSeatSizeChange = (size: number) => {
  seatPageSize.value = size;
  remoteSearchSeats('');
};

const handleSeatPageChange = (page: number) => {
  seatPage.value = page;
  remoteSearchSeats('');
};

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      studentId: searchForm.studentId,
      examSeatId: searchForm.examSeatId,
      examType: searchForm.examType,
      examLevel: searchForm.examLevel
    };
    
    const res = await getExamInfoList(params);
    if (res.code === 200) {
      const records = res.data.records || [];
      const examInfos = await Promise.all(records.map(async (info: ExamInfo) => {
        // 获取学生姓名
        if (info.studentId) {
          const studentRes = await getStudentDetail(info.studentId);
          if (studentRes.code === 200 && studentRes.data) {
            info.studentName = studentRes.data.name;
          }
        }
        // 获取座位详细信息
        if (info.examSeatId) {
          const seatRes = await getExamSeatDetail(info.examSeatId);
          if (seatRes.code === 200 && seatRes.data) {
            info.seatNumber = seatRes.data.seatNumber;
            info.roomNumber = seatRes.data.examRoomName;
            info.examSiteName = seatRes.data.examSiteName;
          }
        }
        return info;
      }));
      tableData.value = examInfos;
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
  searchForm.studentId = undefined;
  searchForm.examSeatId = undefined;
  searchForm.examType = undefined;
  searchForm.examLevel = undefined;
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

// 添加考试信息
const handleAdd = () => {
  dialogType.value = 'add';
  form.id = 0;
  form.studentId = undefined;
  form.examSeatId = undefined;
  form.examTime = '';
  form.examType = '';
  form.examLevel = '';
  dialogVisible.value = true;
};

// 编辑考试信息
const handleEdit = (row: ExamInfo) => {
  dialogType.value = 'edit';
  form.id = row.id;
  form.studentId = row.studentId;
  form.examSeatId = row.examSeatId;
  form.examTime = row.examTime;
  form.examType = row.examType;
  form.examLevel = row.examLevel;
  
  // 如果学生不在选项中，添加到选项
  if (row.studentId && row.studentName && !studentOptions.value.some(opt => opt.value === row.studentId)) {
    studentOptions.value.push({
      value: row.studentId,
      label: row.studentName
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
        if (!submitData.id) delete submitData.id;
        if (dialogType.value === 'add') {
          const res = await createExamInfo(submitData);
          if (res.code === 200) {
            if (res.message) ElMessage.success(res.message);
            dialogVisible.value = false;
            loadData();
          } else {
            if (res.message) ElMessage.error(res.message);
          }
        } else {
          const res = await updateExamInfo(submitData);
          if (res.code === 200) {
            if (res.message) ElMessage.success(res.message);
            dialogVisible.value = false;
            loadData();
          } else {
            if (res.message) ElMessage.error(res.message);
          }
        }
      } catch (error) {
        // 只弹后端返回的消息，不再弹固定消息
      }
    }
  });
};

// 删除考试信息
const handleDelete = async (id: number) => {
  try {
    const res = await deleteExamInfo(id);
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
    // 只弹后端返回的消息，不再弹固定消息
  }
};

// 初始化
onMounted(async () => {
  await Promise.all([
    remoteSearchStudents(''),
    remoteSearchSeats('')
  ]);
  loadData();
});
</script>

<style scoped>
.exam-info-container {
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

:deep(.student-select-dropdown),
:deep(.seat-select-dropdown) {
  .select-footer {
    padding: 8px;
    text-align: center;
    border-top: 1px solid #e4e7ed;
  }
  
  .el-pagination {
    padding: 0;
    margin: 0;
  }
}

:deep(.el-table) {
  transition: all 0.3s ease-in-out;
}

:deep(.el-table__body-wrapper) {
  transition: all 0.3s ease-in-out;
}

:deep(.el-pagination) {
  transition: all 0.3s ease-in-out;
}

:deep(.el-table__empty-block) {
  transition: all 0.3s ease-in-out;
}

:deep(.el-select-dropdown) {
  .el-select-dropdown__wrap {
    max-height: 274px;
    overflow-y: auto;
    transition: all 0.3s ease-in-out;
  }
  
  .el-select-dropdown__list {
    padding: 6px 0;
    transition: all 0.3s ease-in-out;
  }
  
  .el-select-dropdown__item {
    height: 34px;
    line-height: 34px;
    transition: all 0.3s ease-in-out;
  }
  
  .select-footer {
    position: sticky;
    bottom: 0;
    background: #fff;
    z-index: 1;
    padding: 8px;
    text-align: center;
    border-top: 1px solid #e4e7ed;
    transition: all 0.3s ease-in-out;
  }
  
  .el-pagination {
    padding: 0;
    margin: 0;
    transition: all 0.3s ease-in-out;
  }
}

:deep(.el-select) {
  .el-input__wrapper {
    transition: all 0.3s ease-in-out;
  }
  
  .el-select__tags {
    transition: all 0.3s ease-in-out;
  }
}
</style> 