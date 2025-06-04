<template>
  <div class="exam-seats-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h2>考试座位管理</h2>
          <div class="header-buttons">
            <el-button type="primary" @click="handleBatchAdd">批量添加座位</el-button>
            <el-button type="primary" @click="handleAdd">添加座位</el-button>
          </div>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <div class="search-area">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="座位号">
            <el-input v-model="searchForm.seatNumber" placeholder="输入座位号" clearable />
          </el-form-item>
          <el-form-item label="考点">
            <el-select v-model="searchForm.examSiteId" placeholder="选择考点" clearable style="width: 200px" @change="handleExamSiteChange">
              <el-option
                v-for="item in examSiteOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="考场">
            <el-select v-model="searchForm.examRoomId" placeholder="选择考场" clearable style="width: 200px">
              <el-option
                v-for="item in examRoomOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="选择状态" clearable style="width: 120px">
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
        <el-table-column prop="examRoomName" label="所属考场" min-width="120" />
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
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
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
        <el-form-item label="所属考点" prop="examSiteId">
          <el-select v-model="form.examSiteId" placeholder="请选择考点" style="width: 200px" @change="handleExamSiteChange">
            <el-option
              v-for="item in examSiteOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属考场" prop="examRoomId">
          <el-select v-model="form.examRoomId" placeholder="请选择考场" style="width: 200px" @change="handleExamRoomChange">
            <el-option
              v-for="item in examRoomOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 120px" :disabled="true">
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
    
    <!-- 批量添加座位对话框 -->
    <el-dialog
      v-model="batchDialogVisible"
      title="批量添加座位"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="batchForm"
        :rules="batchFormRules"
        label-width="100px"
      >
        <el-form-item label="所属考点" prop="examSiteId">
          <el-select v-model="batchForm.examSiteId" placeholder="请选择考点" style="width: 100%" @change="handleExamSiteChange">
            <el-option
              v-for="item in examSiteOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属考场" prop="examRoomId">
          <el-select v-model="batchForm.examRoomId" placeholder="请选择考场" style="width: 100%">
            <el-option
              v-for="item in examRoomOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="起始座位号" prop="startNumber">
          <el-input-number v-model="batchForm.startNumber" :min="1" :max="999" />
        </el-form-item>
        <el-form-item label="座位数量" prop="count">
          <el-input-number v-model="batchForm.count" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="batchForm.status" placeholder="请选择状态" style="width: 100%" :disabled="true">
            <el-option label="未占用" :value="0" />
            <el-option label="已占用" :value="1" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="batchDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitBatchForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage, FormInstance } from 'element-plus';
import type { ExamSeat } from '@/types/exam-seat';
import type { ExamRoom } from '@/types/exam-room';
import type { ExamSite } from '@/types/exam-site';
import { getExamSeatList, createExamSeat, updateExamSeat, deleteExamSeat, batchCreateExamSeats } from '@/api/examSeat';
import { getAllExamRooms } from '@/api/examRoom';
import { getAllExamSites } from '@/api/examSite';
import { EXAM_SEAT_STATUS } from '@/constants/api';

// 表格数据
const tableData = ref<ExamSeat[]>([]);
const loading = ref(false);

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  examSiteId: undefined as number | undefined,
  examRoomId: undefined as number | undefined,
  seatNumber: '',
  status: undefined as number | undefined
});

// 分页参数
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
});

// 考点选项
const examSiteOptions = ref<{ value: number; label: string }[]>([]);

// 考场选项
const examRoomOptions = ref<{ value: number; label: string; examSiteId?: number }[]>([]);
const examRoomMap = ref<Map<number, ExamRoom>>(new Map());

// 搜索表单
const searchForm = reactive({
  seatNumber: '',
  examSiteId: undefined as number | undefined,
  examRoomId: undefined as number | undefined,
  status: undefined as number | undefined
});

// 添加/编辑表单
const formRef = ref<FormInstance>();
const form = reactive<Partial<ExamSeat>>({
  seatNumber: '',
  examSiteId: undefined,
  examRoomId: undefined,
  status: EXAM_SEAT_STATUS.AVAILABLE
});

// 表单验证规则
const rules = {
  seatNumber: [{ required: true, message: '请输入座位号', trigger: 'blur' }],
  examSiteId: [{ required: true, message: '请选择所属考点', trigger: 'change' }],
  examRoomId: [{ required: true, message: '请选择所属考场', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
};

// 对话框控制
const dialogVisible = ref(false);
const dialogType = ref<'add' | 'edit'>('add');

// 批量添加座位对话框
const batchDialogVisible = ref(false);
const batchForm = reactive({
  examSiteId: undefined as number | undefined,
  examRoomId: undefined as number | undefined,
  startNumber: 1,
  count: 30,
  status: EXAM_SEAT_STATUS.AVAILABLE
});

const batchFormRules = {
  examSiteId: [{ required: true, message: '请选择所属考点', trigger: 'change' }],
  examRoomId: [{ required: true, message: '请选择所属考场', trigger: 'change' }],
  startNumber: [{ required: true, message: '请输入起始座位号', trigger: 'blur' }],
  count: [{ required: true, message: '请输入座位数量', trigger: 'blur' }]
};

// 加载考点数据
const loadExamSites = async () => {
  try {
    const res = await getAllExamSites();
    if (res.code === 200) {
      examSiteOptions.value = res.data
        .filter((site) => site.id !== undefined)
        .map((site) => ({
          value: site.id!,
          label: site.name
        }));
    }
  } catch (error) {
    console.error('加载考点数据出错:', error);
    ElMessage.error('获取考点数据失败');
  }
};

// 加载考场数据
const loadExamRooms = async (examSiteId?: number) => {
  try {
    const res = await getAllExamRooms(examSiteId);
    if (res.code === 200) {
      examRoomMap.value.clear();
      
      // 适配后端返回的不同数据结构
      let roomList: ExamRoom[] = [];
      if (res.data.records && Array.isArray(res.data.records)) {
        roomList = res.data.records;
      } else if (Array.isArray(res.data)) {
        roomList = res.data;
      } else {
        console.error('无法识别的数据格式:', res.data);
        roomList = [];
      }
      
      roomList.forEach((room) => {
        if (room.id !== undefined) {
          examRoomMap.value.set(room.id, room);
        }
      });
      
      examRoomOptions.value = roomList
        .filter((room) => room.id !== undefined)
        .map((room) => ({
          value: room.id!,
          label: room.roomNumber,
          examSiteId: room.examSiteId
        }));
    }
  } catch (error) {
    console.error('加载考场数据出错:', error);
    ElMessage.error('获取考场数据失败');
  }
};

// 考点选择变更处理
const handleExamSiteChange = async (examSiteId: number) => {
  form.examRoomId = undefined;
  await loadExamRooms(examSiteId);
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
    const res = await getExamSeatList({
      pageNum: queryParams.pageNum,
      pageSize: queryParams.pageSize,
      examRoomId: queryParams.examRoomId,
      seatNumber: queryParams.seatNumber
    });
    if (res.code === 200) {
      tableData.value = res.data.records;
      pagination.total = res.data.total;
    } else {
      ElMessage.error(res.message || '获取座位列表失败');
    }
  } catch (error) {
    console.error('获取座位列表出错:', error);
    ElMessage.error('获取座位列表失败');
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  queryParams.pageNum = 1;
  loadData();
};

// 重置搜索
const resetSearch = () => {
  queryParams.seatNumber = '';
  queryParams.examSiteId = undefined;
  queryParams.examRoomId = undefined;
  queryParams.status = undefined;
  queryParams.pageNum = 1;
  loadData();
};

// 处理分页变化
const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val;
  loadData();
};

const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  queryParams.pageNum = 1;
  loadData();
};

// 添加座位
const handleAdd = () => {
  dialogType.value = 'add';
  form.id = undefined;
  form.seatNumber = '';
  form.examSiteId = undefined;
  form.examRoomId = undefined;
  form.status = EXAM_SEAT_STATUS.AVAILABLE;
  dialogVisible.value = true;
};

// 编辑座位
const handleEdit = async (row: ExamSeat) => {
  dialogType.value = 'edit';
  form.id = row.id;
  form.seatNumber = row.seatNumber;
  form.examSiteId = row.examSiteId;
  form.examRoomId = row.examRoomId;
  form.status = row.status;
  
  // 加载该考点下的考场列表，以便考场下拉框正确回显
  if (form.examSiteId) {
    await loadExamRooms(form.examSiteId);
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
      if (tableData.value.length === 1 && queryParams.pageNum > 1) {
        queryParams.pageNum--;
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

// 批量添加座位
const handleBatchAdd = () => {
  batchForm.examSiteId = undefined;
  batchForm.examRoomId = undefined;
  batchForm.startNumber = 1;
  batchForm.count = 30;
  batchDialogVisible.value = true;
};

// 提交批量添加
const submitBatchForm = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const room = examRoomMap.value.get(batchForm.examRoomId!);
        if (!room) {
          ElMessage.error('考场信息不存在');
          return;
        }

        const seats: ExamSeat[] = [];
        for (let i = 0; i < batchForm.count; i++) {
          const seatNumber = `${room.roomNumber}-${batchForm.startNumber + i}`;
          seats.push({
            examRoomId: batchForm.examRoomId!,
            examSiteId: batchForm.examSiteId!,
            seatNumber,
            status: batchForm.status
          });
        }

        const res = await batchCreateExamSeats(seats);
        if (res.code === 200) {
          ElMessage.success('批量添加座位成功');
          batchDialogVisible.value = false;
          loadData();
        } else {
          ElMessage.error(res.message || '批量添加座位失败');
        }
      } catch (error) {
        console.error('批量添加座位出错:', error);
        ElMessage.error('批量添加座位失败');
      }
    }
  });
};

// 初始化
onMounted(async () => {
  await Promise.all([
    loadExamSites(),
    loadExamRooms()
  ]);
  loadData();
});
</script>

<style scoped>
.exam-seats-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-buttons {
  display: flex;
  gap: 10px;
}

.search-area {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 