<template>
  <div class="users-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h2>用户管理</h2>
          <el-button type="primary" @click="handleAdd">添加用户</el-button>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <div class="search-area">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="用户名">
            <el-input v-model="searchForm.username" placeholder="输入用户名" clearable />
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
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="realName" label="真实姓名" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="phone" label="手机号" min-width="140" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm
              title="确定删除该用户吗？"
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
    
    <!-- 添加/编辑用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入真实姓名" />
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
import type { User } from '@/types/user';
import { getUserList, createUser, updateUser, deleteUser } from '@/api/user';

// 表格数据
const tableData = ref<User[]>([]);
const loading = ref(false);

// 分页
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 搜索表单
const searchForm = reactive({
  username: ''
});

// 添加/编辑表单
const formRef = ref<FormInstance>();
const form = reactive<Partial<User>>({
  username: '',
  realName: '',
  email: '',
  phone: '',
  password: ''
});

// 表单验证规则
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
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
    const params = {
      current: currentPage.value,
      size: pageSize.value,
      username: searchForm.username || undefined
    };
    
    const res = await getUserList(params);
    
    if (res.code === 200) {
      tableData.value = res.data.records;
      total.value = res.data.total;
    } else {
      ElMessage.error(res.message || '获取用户列表失败');
      tableData.value = [];
      total.value = 0;
    }
  } catch (error) {
    console.error('加载用户数据出错:', error);
    ElMessage.error('获取用户列表失败');
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
  searchForm.username = '';
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

// 添加用户
const handleAdd = () => {
  dialogType.value = 'add';
  form.id = undefined;
  form.username = '';
  form.realName = '';
  form.email = '';
  form.phone = '';
  form.password = '';
  dialogVisible.value = true;
};

// 编辑用户
const handleEdit = (row: User) => {
  dialogType.value = 'edit';
  form.id = row.id;
  form.username = row.username;
  form.realName = row.realName || '';
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
          
          // 确保username不为undefined
          if (restForm.username) {
            const res = await updateUser(restForm as User);
            if (res.code === 200) {
              ElMessage.success('更新用户成功');
              dialogVisible.value = false;
              loadData();
            } else {
              ElMessage.error(res.message || '更新用户失败');
            }
          } else {
            ElMessage.error('用户名不能为空');
          }
        } else {
          // 添加模式或密码不为空
          // 确保username不为undefined
          if (form.username) {
            const res = dialogType.value === 'add' 
              ? await createUser(form as User)
              : await updateUser(form as User);
              
            if (res.code === 200) {
              ElMessage.success(dialogType.value === 'add' ? '添加用户成功' : '更新用户成功');
              dialogVisible.value = false;
              loadData();
            } else {
              ElMessage.error(res.message || (dialogType.value === 'add' ? '添加用户失败' : '更新用户失败'));
            }
          } else {
            ElMessage.error('用户名不能为空');
          }
        }
      } catch (error) {
        console.error('提交表单出错:', error);
        ElMessage.error('操作失败，请重试');
      }
    }
  });
};

// 删除用户
const handleDelete = async (id: number) => {
  try {
    const res = await deleteUser(id);
    if (res.code === 200) {
      ElMessage.success('删除用户成功');
      if (tableData.value.length === 1 && currentPage.value > 1) {
        currentPage.value--;
      }
      loadData();
    } else {
      ElMessage.error(res.message || '删除用户失败');
    }
  } catch (error) {
    console.error('删除用户出错:', error);
    ElMessage.error('删除用户失败');
  }
};

// 初始化
onMounted(() => {
  loadData();
});
</script>

<style scoped>
/* 使用通用样式 */
</style> 