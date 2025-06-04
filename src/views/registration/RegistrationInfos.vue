<template>
  <!-- ... existing code ... -->
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
  <!-- ... existing code ... -->
</template>

<script setup>
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  studentName: '',
  identityDocumentNumber: ''
});

// 分页参数
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
});

// 加载数据
const loadData = async () => {
  try {
    const res = await getRegistrationInfoList({
      pageNum: queryParams.pageNum,
      pageSize: queryParams.pageSize,
      studentName: queryParams.studentName,
      identityDocumentNumber: queryParams.identityDocumentNumber
    });
    if (res.code === 200) {
      tableData.value = res.data.records;
      pagination.total = res.data.total;
    } else {
      ElMessage.error(res.message || '获取报名信息列表失败');
    }
  } catch (error) {
    console.error('获取报名信息列表出错:', error);
    ElMessage.error('获取报名信息列表失败');
  }
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
</script> 