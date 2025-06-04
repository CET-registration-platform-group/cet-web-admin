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
        style="width: 100%; margin-bottom: 15px;"
        border
        stripe
        :header-cell-style="{background:'#f5f7fa'}"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="考点名称" min-width="120" />
        <el-table-column prop="address" label="地址" min-width="200" />
        <el-table-column prop="totalSeat" label="总座位数" width="100" />
        <el-table-column prop="usedSeat" label="已分配" width="100" />
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
import type { ExamSite } from '@/types/exam-site';
import { getExamSiteList, createExamSite, updateExamSite, deleteExamSite } from '@/api/exam-site';

// 表格数据
const tableData = ref<ExamSite[]>([]);
const loading = ref(false);

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  name: ''
});

// 分页参数
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
});

// 搜索表单
const searchForm = reactive({
  name: ''
});

// 添加/编辑表单
const formRef = ref<FormInstance>();
const form = reactive<Partial<ExamSite>>({
  name: '',
  address: ''
});

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入考点名称', trigger: 'blur' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }]
};

// 对话框控制
const dialogVisible = ref(false);
const dialogType = ref<'add' | 'edit'>('add');

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const res = await getExamSiteList({
      pageNum: queryParams.pageNum,
      pageSize: queryParams.pageSize,
      name: queryParams.name
    });
    if (res.code === 200) {
      tableData.value = res.data.records;
      pagination.total = res.data.total;
    } else {
      ElMessage.error(res.message || '获取考点列表失败');
    }
  } catch (error) {
    console.error('获取考点列表出错:', error);
    ElMessage.error('获取考点列表失败');
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
  searchForm.name = '';
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

// 添加考点
const handleAdd = () => {
  dialogType.value = 'add';
  form.id = undefined;
  form.name = '';
  form.address = '';
  dialogVisible.value = true;
};

// 编辑考点
const handleEdit = (row: ExamSite) => {
  dialogType.value = 'edit';
  form.id = row.id;
  form.name = row.name;
  form.address = row.address;
  dialogVisible.value = true;
};

// 删除考点
const handleDelete = async (id: number) => {
  try {
    const res = await deleteExamSite(id);
    if (res.code === 200) {
      ElMessage.success('删除成功');
      loadData();
    } else {
      ElMessage.error(res.message || '删除失败');
    }
  } catch (error) {
    console.error('删除考点出错:', error);
    ElMessage.error('删除失败');
  }
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const api = dialogType.value === 'add' ? createExamSite : updateExamSite;
        const res = await api(form as ExamSite);
        
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

// 初始化
onMounted(() => {
  loadData();
});
</script>

<style scoped>
.exam-sites-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
}

.search-area {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style> 