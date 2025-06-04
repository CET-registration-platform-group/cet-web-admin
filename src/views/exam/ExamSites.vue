<template>
  <div class="exam-sites-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h2>考点管理</h2>
          <el-button type="primary" @click="handleAdd">添加考点</el-button>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <div class="search-area">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="考点名称">
            <el-input v-model="searchForm.name" placeholder="输入考点名称" clearable />
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
        <el-table-column prop="name" label="考点名称" min-width="150" />
        <el-table-column prop="address" label="地址" min-width="200" />
        <el-table-column prop="totalSeat" label="座位总数" width="100" />
        <el-table-column prop="usedSeat" label="已用座位数" width="100" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm
              title="确定删除该考点吗？"
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
    
    <!-- 添加/编辑考点对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加考点' : '编辑考点'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="考点名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入考点名称" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="座位总数" prop="totalSeat">
          <el-input-number v-model="form.totalSeat" :min="0" />
        </el-form-item>
        <el-form-item label="已用座位数" prop="usedSeat">
          <el-input-number v-model="form.usedSeat" :min="0" :max="form.totalSeat" />
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
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
import { ExamSite } from '@/types';
import { getExamSiteList, createExamSite, updateExamSite, deleteExamSite } from '@/api/examSite';

// 表格数据
const tableData = ref<ExamSite[]>([]);
const loading = ref(false);

// 分页
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 搜索表单
const searchForm = reactive({
  name: ''
});

// 添加/编辑表单
const formRef = ref<FormInstance>();
const form = reactive<Partial<ExamSite>>({
  name: '',
  address: '',
  totalSeat: 0,
  usedSeat: 0
});

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入考点名称', trigger: 'blur' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
  totalSeat: [{ required: true, message: '请输入座位总数', trigger: 'blur' }]
};

// 对话框控制
const dialogVisible = ref(false);
const dialogType = ref<'add' | 'edit'>('add');

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const params = {
      current: currentPage.value,
      size: pageSize.value,
      name: searchForm.name || undefined
    };
    
    const res = await getExamSiteList(params);
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
      ElMessage.error(res.message || '获取考点列表失败');
      tableData.value = [];
      total.value = 0;
    }
  } catch (error) {
    console.error('加载考点数据出错:', error);
    ElMessage.error('获取考点列表失败');
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
  searchForm.name = '';
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

// 添加考点
const handleAdd = () => {
  dialogType.value = 'add';
  form.id = undefined;
  form.name = '';
  form.address = '';
  form.totalSeat = 0;
  form.usedSeat = 0;
  dialogVisible.value = true;
};

// 编辑考点
const handleEdit = (row: ExamSite) => {
  dialogType.value = 'edit';
  form.id = row.id;
  form.name = row.name;
  form.address = row.address;
  form.totalSeat = row.totalSeat;
  form.usedSeat = row.usedSeat;
  dialogVisible.value = true;
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          const res = await createExamSite(form);
          if (res.code === 200) {
            ElMessage.success('添加考点成功');
            dialogVisible.value = false;
            loadData();
          } else {
            ElMessage.error(res.message || '添加考点失败');
          }
        } else {
          const res = await updateExamSite(form);
          if (res.code === 200) {
            ElMessage.success('更新考点成功');
            dialogVisible.value = false;
            loadData();
          } else {
            ElMessage.error(res.message || '更新考点失败');
          }
        }
      } catch (error) {
        console.error('提交表单出错:', error);
        ElMessage.error('操作失败，请重试');
      }
    }
  });
};

// 删除考点
const handleDelete = async (id: number) => {
  try {
    const res = await deleteExamSite(id);
    if (res.code === 200) {
      ElMessage.success('删除考点成功');
      if (tableData.value.length === 1 && currentPage.value > 1) {
        currentPage.value--;
      }
      loadData();
    } else {
      ElMessage.error(res.message || '删除考点失败');
    }
  } catch (error) {
    console.error('删除考点出错:', error);
    ElMessage.error('删除考点失败');
  }
};

// 初始化
onMounted(() => {
  loadData();
});
</script>

<style scoped>
/* 删除局部样式，使用通用样式 */
</style> 