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
          <el-form-item label="考场号">
            <el-input v-model="searchForm.roomNumber" placeholder="输入考场号" clearable />
          </el-form-item>
          <el-form-item label="考点">
            <el-select v-model="searchForm.examSiteId" placeholder="选择考点" clearable>
              <el-option
                v-for="item in examSiteOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
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
        <el-table-column prop="roomNumber" label="考场号" min-width="120" />
        <el-table-column prop="examSiteName" label="所属考点" min-width="180" />
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
        <el-form-item label="考场号" prop="roomNumber">
          <el-input v-model="form.roomNumber" placeholder="请输入考场号" />
        </el-form-item>
        <el-form-item label="所属考点" prop="examSiteId">
          <el-select v-model="form.examSiteId" placeholder="请选择考点" style="width: 100%">
            <el-option
              v-for="item in examSiteOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
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
import { ExamRoom, ExamSite } from '@/types';
import { getExamRoomList, createExamRoom, updateExamRoom, deleteExamRoom } from '@/api/examRoom';
import { getExamSiteList } from '@/api/examSite';

// 表格数据
const tableData = ref<ExamRoom[]>([]);
const loading = ref(false);

// 分页
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

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
    const res = await getExamSiteList({ size: 1000 });
    if (res.code === 200) {
      // 适配后端返回的不同数据结构
      if (res.data.records && Array.isArray(res.data.records)) {
        examSiteOptions.value = res.data.records.map((site: ExamSite) => ({
          value: site.id,
          label: site.name
        }));
      } else if (res.data.items && Array.isArray(res.data.items)) {
        examSiteOptions.value = res.data.items.map((site: ExamSite) => ({
          value: site.id,
          label: site.name
        }));
      } else if (Array.isArray(res.data)) {
        examSiteOptions.value = res.data.map((site: ExamSite) => ({
          value: site.id,
          label: site.name
        }));
      } else {
        console.error('无法识别的数据格式:', res.data);
        examSiteOptions.value = [];
      }
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
    const params = {
      current: currentPage.value,
      size: pageSize.value,
      roomNumber: searchForm.roomNumber || undefined,
      examSiteId: searchForm.examSiteId
    };
    
    const res = await getExamRoomList(params);
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
      ElMessage.error(res.message || '获取考场列表失败');
      tableData.value = [];
      total.value = 0;
    }
  } catch (error) {
    console.error('加载考场数据出错:', error);
    ElMessage.error('获取考场列表失败');
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
  searchForm.roomNumber = '';
  searchForm.examSiteId = undefined;
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
        if (dialogType.value === 'add') {
          const res = await createExamRoom(form);
          if (res.code === 200) {
            ElMessage.success('添加考场成功');
            dialogVisible.value = false;
            loadData();
          } else {
            ElMessage.error(res.message || '添加考场失败');
          }
        } else {
          const res = await updateExamRoom(form);
          if (res.code === 200) {
            ElMessage.success('更新考场成功');
            dialogVisible.value = false;
            loadData();
          } else {
            ElMessage.error(res.message || '更新考场失败');
          }
        }
      } catch (error) {
        console.error('提交表单出错:', error);
        ElMessage.error('操作失败，请重试');
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
      if (tableData.value.length === 1 && currentPage.value > 1) {
        currentPage.value--;
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

// 初始化
onMounted(() => {
  loadExamSites();
  loadData();
});
</script>

<style scoped>
/* 删除局部样式，使用通用样式 */
</style> 