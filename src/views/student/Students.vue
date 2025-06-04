<template>
  <div class="students-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h2>学生管理</h2>
          <el-button type="primary" @click="handleAdd">添加学生</el-button>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <div class="search-area">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="姓名">
            <el-input v-model="searchForm.name" placeholder="输入姓名" clearable />
          </el-form-item>
          <el-form-item label="证件号">
            <el-input v-model="searchForm.identityDocumentNumber" placeholder="输入证件号" clearable />
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
        <el-table-column prop="name" label="姓名" min-width="100" />
        <el-table-column label="证件类型" width="100">
          <template #default="scope">
            {{ scope.row.identityDocumentType === 0 ? '身份证' : '护照' }}
          </template>
        </el-table-column>
        <el-table-column prop="identityDocumentNumber" label="证件号" min-width="180" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="phone" label="手机号" min-width="140" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm
              title="确定删除该学生吗？"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 添加调试信息 -->
      <div v-if="tableData.length === 0 && !loading" style="text-align: center; padding: 20px; color: #909399;">
        <p>暂无数据</p>
        <p>调试信息: 表格数据长度 {{ tableData.length }}, 总数 {{ total }}</p>
      </div>
      
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
    
    <!-- 添加/编辑学生对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加学生' : '编辑学生'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="证件类型" prop="identityDocumentType">
          <el-select v-model="form.identityDocumentType" placeholder="请选择证件类型" style="width: 100%">
            <el-option label="身份证" :value="0" />
            <el-option label="护照" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码" prop="identityDocumentNumber">
          <el-input v-model="form.identityDocumentNumber" placeholder="请输入证件号码" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogType === 'add'">
          <el-input v-model="form.password" placeholder="请输入密码" type="password" />
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
import { Student } from '@/types';
import { getStudentList, createStudent, updateStudent, deleteStudent } from '@/api/student';

// 表格数据
const tableData = ref<Student[]>([]);
const loading = ref(false);

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  name: '',
  idNumber: '',
  email: ''
});

// 分页参数
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
});

// 搜索表单
const searchForm = reactive({
  name: '',
  identityDocumentNumber: ''
});

// 添加/编辑表单
const formRef = ref<FormInstance>();
const form = reactive<Partial<Student>>({
  name: '',
  identityDocumentType: 0,
  identityDocumentNumber: '',
  email: '',
  phone: '',
  password: ''
});

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  identityDocumentType: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
  identityDocumentNumber: [{ required: true, message: '请输入证件号码', trigger: 'blur' }],
  email: [
    { required: false, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: false, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur', validator: (_: any, value: string, callback: (error?: Error) => void) => {
      if (dialogType.value === 'add' && !value) {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    }}
  ]
};

// 对话框控制
const dialogVisible = ref(false);
const dialogType = ref<'add' | 'edit'>('add');

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const res = await getStudentList({
      pageNum: queryParams.pageNum,
      pageSize: queryParams.pageSize,
      name: queryParams.name,
      idNumber: queryParams.idNumber,
      email: queryParams.email
    });
    if (res.code === 200) {
      tableData.value = res.data.records;
      pagination.total = res.data.total;
    } else {
      ElMessage.error(res.message || '获取学生列表失败');
    }
  } catch (error) {
    console.error('获取学生列表出错:', error);
    ElMessage.error('获取学生列表失败');
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
  queryParams.name = '';
  queryParams.idNumber = '';
  queryParams.email = '';
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

// 添加学生
const handleAdd = () => {
  dialogType.value = 'add';
  form.id = undefined;
  form.name = '';
  form.identityDocumentType = 0;
  form.identityDocumentNumber = '';
  form.email = '';
  form.phone = '';
  form.password = '';
  dialogVisible.value = true;
};

// 编辑学生
const handleEdit = (row: Student) => {
  dialogType.value = 'edit';
  form.id = row.id;
  form.name = row.name;
  form.identityDocumentType = row.identityDocumentType;
  form.identityDocumentNumber = row.identityDocumentNumber;
  form.email = row.email || '';
  form.phone = row.phone || '';
  form.password = ''; // 编辑时不显示密码
  dialogVisible.value = true;
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 如果是编辑模式且密码为空，则不提交密码字段
        if (dialogType.value === 'edit' && !form.password) {
          const { password, ...restForm } = form;
          
          const res = await updateStudent(restForm);
          if (res.code === 200) {
            ElMessage.success('更新学生成功');
            dialogVisible.value = false;
            loadData();
          } else {
            ElMessage.error(res.message || '更新学生失败');
          }
        } else {
          // 添加模式或密码不为空
          const res = dialogType.value === 'add' 
            ? await createStudent(form)
            : await updateStudent(form);
            
          if (res.code === 200) {
            ElMessage.success(dialogType.value === 'add' ? '添加学生成功' : '更新学生成功');
            dialogVisible.value = false;
            loadData();
          } else {
            ElMessage.error(res.message || (dialogType.value === 'add' ? '添加学生失败' : '更新学生失败'));
          }
        }
      } catch (error) {
        console.error('提交表单出错:', error);
        ElMessage.error('操作失败，请重试');
      }
    }
  });
};

// 删除学生
const handleDelete = async (id: number) => {
  try {
    const res = await deleteStudent(id);
    if (res.code === 200) {
      ElMessage.success('删除学生成功');
      if (tableData.value.length === 1 && queryParams.pageNum > 1) {
        queryParams.pageNum--;
      }
      loadData();
    } else {
      ElMessage.error(res.message || '删除学生失败');
    }
  } catch (error) {
    console.error('删除学生出错:', error);
    ElMessage.error('删除学生失败');
  }
};

// 初始化
onMounted(() => {
  loadData();
});
</script>

<style scoped>
/* 删除局部样式，使用通用样式 */
:deep(.el-card__header) {
  padding: 10px 15px;
}

:deep(.el-card__body) {
  padding: 15px;
}
</style> 