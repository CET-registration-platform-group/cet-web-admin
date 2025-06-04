<template>
  <div class="exam-seats-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h2>考试座位管理</h2>
          <el-button type="primary" @click="handleAdd">添加座位</el-button>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <div class="search-area">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="座位号">
            <el-input v-model="searchForm.seatNumber" placeholder="输入座位号" clearable />
          </el-form-item>
          <el-form-item label="考场">
            <el-select v-model="searchForm.examRoomId" placeholder="选择考场" clearable>
              <el-option
                v-for="item in examRoomOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="选择状态" clearable>
              <el-option label="未占用" :value="0" />
              <el-option label="已占用" :value="1" />
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
        <el-table-column prop="seatNumber" label="座位号" min-width="120" />
        <el-table-column prop="examRoomNumber" label="所属考场" min-width="120" />
        <el-table-column prop="examSiteName" label="所属考点" min-width="180" />
        <el-table-column label="状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">
              {{ scope.row.status === 0 ? '未占用' : '已占用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm
              title="确定删除该座位吗？"
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
    
    <!-- 添加/编辑座位对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加座位' : '编辑座位'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="座位号" prop="seatNumber">
          <el-input v-model="form.seatNumber" placeholder="请输入座位号" />
        </el-form-item>
        <el-form-item label="所属考场" prop="examRoomId">
          <el-select v-model="form.examRoomId" placeholder="请选择考场" style="width: 100%" @change="handleExamRoomChange">
            <el-option
              v-for="item in examRoomOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="未占用" :value="0" />
            <el-option label="已占用" :value="1" />
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
import { ExamSeat, ExamRoom } from '@/types';
import { getExamSeatList, createExamSeat, updateExamSeat, deleteExamSeat } from '@/api/examSeat';
import { getExamRoomList } from '@/api/examRoom';
import { EXAM_SEAT_STATUS } from '@/constants/api';

// 表格数据
const tableData = ref<ExamSeat[]>([]);
const loading = ref(false);

// 分页
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 考场选项
const examRoomOptions = ref<{ value: number; label: string; examSiteId?: number }[]>([]);
const examRoomMap = ref<Map<number, ExamRoom>>(new Map());

// 搜索表单
const searchForm = reactive({
  seatNumber: '',
  examRoomId: undefined as number | undefined,
  status: undefined as number | undefined
});

// 添加/编辑表单
const formRef = ref<FormInstance>();
const form = reactive<Partial<ExamSeat>>({
  seatNumber: '',
  examRoomId: undefined,
  status: EXAM_SEAT_STATUS.AVAILABLE
});

// 表单验证规则
const rules = {
  seatNumber: [{ required: true, message: '请输入座位号', trigger: 'blur' }],
  examRoomId: [{ required: true, message: '请选择所属考场', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
};

// 对话框控制
const dialogVisible = ref(false);
const dialogType = ref<'add' | 'edit'>('add');

// 加载考场数据
const loadExamRooms = async () => {
  try {
    const res = await getExamRoomList({ size: 1000 });
    if (res.code === 200) {
      examRoomMap.value.clear();
      
      // 适配后端返回的不同数据结构
      let roomList: ExamRoom[] = [];
      if (res.data.records && Array.isArray(res.data.records)) {
        roomList = res.data.records;
      } else if (res.data.items && Array.isArray(res.data.items)) {
        roomList = res.data.items;
      } else if (Array.isArray(res.data)) {
        roomList = res.data;
      } else {
        console.error('无法识别的数据格式:', res.data);
        roomList = [];
      }
      
      roomList.forEach((room: ExamRoom) => {
        examRoomMap.value.set(room.id, room);
      });
      
      examRoomOptions.value = roomList.map((room: ExamRoom) => ({
        value: room.id,
        label: `${room.roomNumber}${room.examSiteName ? ` (${room.examSiteName})` : ''}`,
        examSiteId: room.examSiteId
      }));
    }
  } catch (error) {
    console.error('加载考场数据出错:', error);
    ElMessage.error('获取考场数据失败');
  }
};

// 考场选择变更处理
const handleExamRoomChange = (examRoomId: number) => {
  if (examRoomId && examRoomMap.value.has(examRoomId)) {
    const room = examRoomMap.value.get(examRoomId);
    if (room) {
      form.examSiteId = room.examSiteId;
    }
  }
};

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const params = {
      current: currentPage.value,
      size: pageSize.value,
      seatNumber: searchForm.seatNumber || undefined,
      examRoomId: searchForm.examRoomId,
      status: searchForm.status
    };
    
    const res = await getExamSeatList(params);
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
      ElMessage.error(res.message || '获取座位列表失败');
      tableData.value = [];
      total.value = 0;
    }
  } catch (error) {
    console.error('加载座位数据出错:', error);
    ElMessage.error('获取座位列表失败');
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
  searchForm.seatNumber = '';
  searchForm.examRoomId = undefined;
  searchForm.status = undefined;
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

// 添加座位
const handleAdd = () => {
  dialogType.value = 'add';
  form.id = undefined;
  form.seatNumber = '';
  form.examRoomId = undefined;
  form.examSiteId = undefined;
  form.status = EXAM_SEAT_STATUS.AVAILABLE;
  dialogVisible.value = true;
};

// 编辑座位
const handleEdit = (row: ExamSeat) => {
  dialogType.value = 'edit';
  form.id = row.id;
  form.seatNumber = row.seatNumber;
  form.examRoomId = row.examRoomId;
  form.examSiteId = row.examSiteId;
  form.status = row.status;
  dialogVisible.value = true;
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          const res = await createExamSeat(form);
          if (res.code === 200) {
            ElMessage.success('添加座位成功');
            dialogVisible.value = false;
            loadData();
          } else {
            ElMessage.error(res.message || '添加座位失败');
          }
        } else {
          const res = await updateExamSeat(form);
          if (res.code === 200) {
            ElMessage.success('更新座位成功');
            dialogVisible.value = false;
            loadData();
          } else {
            ElMessage.error(res.message || '更新座位失败');
          }
        }
      } catch (error) {
        console.error('提交表单出错:', error);
        ElMessage.error('操作失败，请重试');
      }
    }
  });
};

// 删除座位
const handleDelete = async (id: number) => {
  try {
    const res = await deleteExamSeat(id);
    if (res.code === 200) {
      ElMessage.success('删除座位成功');
      if (tableData.value.length === 1 && currentPage.value > 1) {
        currentPage.value--;
      }
      loadData();
    } else {
      ElMessage.error(res.message || '删除座位失败');
    }
  } catch (error) {
    console.error('删除座位出错:', error);
    ElMessage.error('删除座位失败');
  }
};

// 初始化
onMounted(() => {
  loadExamRooms();
  loadData();
});
</script>

<style scoped>
/* 删除局部样式，使用通用样式 */
</style> 