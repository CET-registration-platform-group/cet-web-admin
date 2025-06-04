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
            <el-select v-model="searchForm.examSeatId" placeholder="选择座位" clearable>
              <el-option
                v-for="item in seatOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="考试类型">
            <el-select v-model="searchForm.examType" placeholder="选择类型" clearable>
              <el-option label="笔试" value="笔试" />
              <el-option label="口试" value="口试" />
            </el-select>
          </el-form-item>
          <el-form-item label="考试级别">
            <el-select v-model="searchForm.examLevel" placeholder="选择级别" clearable>
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
      >
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
          <el-select v-model="form.studentId" placeholder="请选择学生" style="width: 100%" filterable remote :remote-method="remoteSearchStudents" :loading="studentLoading">
            <el-option
              v-for="item in studentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="座位" prop="examSeatId">
          <el-select v-model="form.examSeatId" placeholder="请选择座位" style="width: 100%">
            <el-option
              v-for="item in seatOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
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
import { getExamSeatList } from '@/api/examSeat';
import { getStudentList } from '@/api/student';

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

// 远程搜索学生
const remoteSearchStudents = async (query: string) => {
  if (query.length < 1) return;
  
  studentLoading.value = true;
  try {
    const params = {
      size: 20,
      name: query
    };
    
    const res = await getStudentList(params);
    if (res.code === 200) {
      // 适配后端返回的不同数据结构
      let studentList: Student[] = [];
      if (res.data.records && Array.isArray(res.data.records)) {
        studentList = res.data.records;
      } else if (res.data.items && Array.isArray(res.data.items)) {
        studentList = res.data.items;
      } else if (Array.isArray(res.data)) {
        studentList = res.data;
      } else {
        console.error('无法识别的数据格式:', res.data);
        studentList = [];
      }
      
      studentOptions.value = studentList.map((student: Student) => ({
        value: student.id,
        label: `${student.name} (${student.identityDocumentNumber})`
      }));
    }
  } catch (error) {
    console.error('搜索学生出错:', error);
  } finally {
    studentLoading.value = false;
  }
};

// 加载座位数据
const loadExamSeats = async () => {
  try {
    const params = {
      size: 1000,
      status: 0 // 使用数字0表示可用状态
    };
    
    const res = await getExamSeatList(params);
    if (res.code === 200) {
      // 适配后端返回的不同数据结构
      let seatList: ExamSeat[] = [];
      if (res.data.records && Array.isArray(res.data.records)) {
        seatList = res.data.records;
      } else if (res.data.items && Array.isArray(res.data.items)) {
        seatList = res.data.items;
      } else if (Array.isArray(res.data)) {
        seatList = res.data;
      } else {
        console.error('无法识别的数据格式:', res.data);
        seatList = [];
      }
      
      seatOptions.value = seatList.map((seat: ExamSeat) => ({
        value: seat.id,
        label: `${seat.seatNumber} - ${seat.examRoomNumber || ''} ${seat.examSiteName ? `(${seat.examSiteName})` : ''}`
      }));
    }
  } catch (error) {
    console.error('加载座位数据出错:', error);
    ElMessage.error('获取座位数据失败');
  }
};

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const params = {
      current: currentPage.value,
      size: pageSize.value,
      studentId: searchForm.studentId,
      examSeatId: searchForm.examSeatId,
      examType: searchForm.examType,
      examLevel: searchForm.examLevel
    };
    
    const res = await getExamInfoList(params);
    if (res.code === 200) {
      // 适配后端返回的不同数据结构
      if (res.data.records && Array.isArray(res.data.records)) {
        tableData.value = res.data.records;
        total.value = res.data.total || 0;
      } else if (res.data.items && Array.isArray(res.data.items)) {
        tableData.value = res.data.items;
        total.value = res.data.total || 0;
      } else if (Array.isArray(res.data)) {
        tableData.value = res.data;
        total.value = res.data.length;
      } else {
        console.error('无法识别的数据格式:', res.data);
        tableData.value = [];
        total.value = 0;
      }
    } else {
      ElMessage.error(res.message || '获取考试信息列表失败');
      tableData.value = [];
      total.value = 0;
    }
  } catch (error) {
    console.error('加载考试信息数据出错:', error);
    ElMessage.error('获取考试信息列表失败');
    tableData.value = [];
    total.value = 0;
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
  form.id = undefined;
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
        if (dialogType.value === 'add') {
          const res = await createExamInfo(form);
          if (res.code === 200) {
            ElMessage.success('添加考试信息成功');
            dialogVisible.value = false;
            loadData();
          } else {
            ElMessage.error(res.message || '添加考试信息失败');
          }
        } else {
          const res = await updateExamInfo(form);
          if (res.code === 200) {
            ElMessage.success('更新考试信息成功');
            dialogVisible.value = false;
            loadData();
          } else {
            ElMessage.error(res.message || '更新考试信息失败');
          }
        }
      } catch (error) {
        console.error('提交表单出错:', error);
        ElMessage.error('操作失败，请重试');
      }
    }
  });
};

// 删除考试信息
const handleDelete = async (id: number) => {
  try {
    const res = await deleteExamInfo(id);
    if (res.code === 200) {
      ElMessage.success('删除考试信息成功');
      if (tableData.value.length === 1 && currentPage.value > 1) {
        currentPage.value--;
      }
      loadData();
    } else {
      ElMessage.error(res.message || '删除考试信息失败');
    }
  } catch (error) {
    console.error('删除考试信息出错:', error);
    ElMessage.error('删除考试信息失败');
  }
};

// 初始化
onMounted(() => {
  loadExamSeats();
  loadData();
});
</script>

<style scoped>
/* 删除局部样式，使用通用样式 */
</style> 