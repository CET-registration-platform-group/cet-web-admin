<template>
  <div class="exam-rooms-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h2>考场管理</h2>
          <el-button type="primary" @click="handleAdd">添加考场</el-button>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <div class="search-area">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="考点">
            <el-select v-model="searchForm.examSiteId" placeholder="选择考点" clearable style="width: 200px">
              <el-option
                v-for="item in examSiteOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="考场号">
            <el-input v-model="searchForm.roomNumber" placeholder="输入考场号" clearable />
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
        <el-table-column prop="roomNumber" label="考场号" min-width="120" />
        <el-table-column prop="examSiteId" label="所属考点" min-width="180">
          <template #default="scope">
            {{ getExamSiteName(scope.row.examSiteId) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm
              title="确定删除该考场吗？"
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
    
    <!-- 添加/编辑考场对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加考场' : '编辑考场'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="所属考点" prop="examSiteId">
          <el-select v-model="form.examSiteId" placeholder="请选择考点" style="width: 200px">
            <el-option
              v-for="item in examSiteOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="考场号" prop="roomNumber">
          <el-input v-model="form.roomNumber" placeholder="请输入考场号" />
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
import type { ExamRoom, ExamRoomQueryParams } from '@/types/exam-room';
import type { ExamSite } from '@/types/exam-site';
import { getExamRoomList, createExamRoom, updateExamRoom, deleteExamRoom } from '@/api/examRoom';
import { getAllExamSites } from '@/api/examSite';

// 表格数据
const tableData = ref<ExamRoom[]>([]);
const loading = ref(false);

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  examSiteId: undefined as number | undefined,
  roomNumber: ''
});

// 分页参数
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
});

// 考点选项
const examSiteOptions = ref<{ value: number; label: string }[]>([]);

// 搜索表单
const searchForm = reactive({
  roomNumber: '',
  examSiteId: undefined as number | undefined
});

// 添加/编辑表单
const formRef = ref<FormInstance>();
const form = reactive<Partial<ExamRoom>>({
  roomNumber: '',
  examSiteId: undefined
});

// 表单验证规则
const rules = {
  roomNumber: [{ required: true, message: '请输入考场号', trigger: 'blur' }],
  examSiteId: [{ required: true, message: '请选择所属考点', trigger: 'change' }]
};

// 对话框控制
const dialogVisible = ref(false);
const dialogType = ref<'add' | 'edit'>('add');

// 加载考点数据
const loadExamSites = async () => {
  try {
    const res = await getAllExamSites();
    if (res.code === 200) {
      examSiteOptions.value = res.data
        .filter((site: ExamSite) => site.id !== undefined)
        .map((site: ExamSite) => ({
          value: site.id!,
          label: site.name
        }));
    }
  } catch (error) {
    console.error('加载考点数据出错:', error);
    ElMessage.error('获取考点数据失败');
  }
};

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const res = await getExamRoomList({
      pageNum: queryParams.pageNum,
      pageSize: queryParams.pageSize,
      examSiteId: queryParams.examSiteId,
      roomNumber: queryParams.roomNumber
    });
    if (res.code === 200) {
      tableData.value = res.data.records;
      pagination.total = res.data.total;
    } else {
      ElMessage.error(res.message || '获取考场列表失败');
    }
  } catch (error) {
    console.error('获取考场列表出错:', error);
    ElMessage.error('获取考场列表失败');
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
  searchForm.roomNumber = '';
  searchForm.examSiteId = undefined;
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

// 添加考场
const handleAdd = () => {
  dialogType.value = 'add';
  form.id = undefined;
  form.roomNumber = '';
  form.examSiteId = undefined;
  dialogVisible.value = true;
};

// 编辑考场
const handleEdit = (row: ExamRoom) => {
  dialogType.value = 'edit';
  form.id = row.id;
  form.roomNumber = row.roomNumber;
  form.examSiteId = row.examSiteId;
  dialogVisible.value = true;
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const examRoom: ExamRoom = {
          id: form.id,
          roomNumber: form.roomNumber!,
          examSiteId: form.examSiteId!
        };
        
        const res = dialogType.value === 'add'
          ? await createExamRoom(examRoom)
          : await updateExamRoom(examRoom);
          
        if (res.code === 200) {
          ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功');
          dialogVisible.value = false;
          loadData();
        } else {
          ElMessage.error(res.message || (dialogType.value === 'add' ? '添加失败' : '更新失败'));
        }
      } catch (error) {
        console.error('提交表单出错:', error);
        ElMessage.error(dialogType.value === 'add' ? '添加失败' : '更新失败');
      }
    }
  });
};

// 删除考场
const handleDelete = async (id: number) => {
  try {
    const res = await deleteExamRoom(id);
    if (res.code === 200) {
      ElMessage.success('删除考场成功');
      if (tableData.value.length === 1 && queryParams.pageNum > 1) {
        queryParams.pageNum--;
      }
      loadData();
    } else {
      ElMessage.error(res.message || '删除考场失败');
    }
  } catch (error) {
    console.error('删除考场出错:', error);
    ElMessage.error('删除考场失败');
  }
};

// 获取考点名称
const getExamSiteName = (examSiteId: number) => {
  const site = examSiteOptions.value.find(item => item.value === examSiteId);
  return site ? site.label : '未知考点';
};

// 初始化
onMounted(() => {
  loadExamSites();
  loadData();
});
</script>

<style scoped>
/* 删除局部样式，使用通用样式 */
</style> 