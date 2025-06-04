import { ref, computed, onMounted } from 'vue';
import { getExamSiteList } from '@/api/examSite';
import { getExamSeatList } from '@/api/examSeat';
import { getExamInfoList } from '@/api/examInfo';
import { getStudentList } from '@/api/student';
import { EXAM_SEAT_STATUS } from '@/constants/api';

export function useStatistics() {
  // 基础数据
  const examSites = ref<any[]>([]);
  const examSeats = ref<any[]>([]);
  const examInfos = ref<any[]>([]);
  const students = ref<any[]>([]);
  const loading = ref(false);
  const dateRange = ref<[Date, Date]>([
    new Date(new Date().setDate(new Date().getDate() - 30)),
    new Date()
  ]);

  // 计算属性：考点总数
  const totalExamSites = computed(() => examSites.value.length);

  // 计算属性：座位总数
  const totalExamSeats = computed(() => examSeats.value.length);

  // 计算属性：注册学生数
  const registeredStudents = computed(() => students.value.length);

  // 计算属性：已分配座位数
  const assignedSeats = computed(() => 
    examSeats.value.filter(seat => seat.status === EXAM_SEAT_STATUS.OCCUPIED).length
  );

  // 计算属性：即将考试数
  const upcomingExams = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return examInfos.value.filter(info => {
      const examDate = new Date(info.examTime);
      examDate.setHours(0, 0, 0, 0);
      return examDate >= today;
    }).length;
  });

  // 计算属性：四级考试人数
  const cet4Count = computed(() => 
    examInfos.value.filter(info => info.examLevel === '四级').length
  );

  // 计算属性：六级考试人数
  const cet6Count = computed(() => 
    examInfos.value.filter(info => info.examLevel === '六级').length
  );

  // 计算属性：考点利用率
  const examSiteUtilization = computed(() => {
    return examSites.value.map(site => {
      const siteSeats = examSeats.value.filter(seat => seat.examSiteId === site.id);
      const occupiedSiteSeats = siteSeats.filter(seat => seat.status === EXAM_SEAT_STATUS.OCCUPIED);
      const utilization = siteSeats.length > 0 ? (occupiedSiteSeats.length / siteSeats.length) * 100 : 0;
      
      return {
        id: site.id,
        name: site.name,
        total: siteSeats.length,
        occupied: occupiedSiteSeats.length,
        utilization: Math.round(utilization * 100) / 100
      };
    });
  });

  // 计算属性：考试类型分布
  const examTypeDistribution = computed(() => {
    const types = ['笔试', '口试'];
    
    return types.map(type => {
      const count = examInfos.value.filter(info => info.examType === type).length;
      
      return { type, count };
    });
  });

  // 计算属性：按天统计的报名人数
  const dailyRegistrations = computed(() => {
    const days = [];
    const end = new Date(dateRange.value[1]);
    let current = new Date(dateRange.value[0]);
    
    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days.map(day => {
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);
      
      const dayRegistrations = examInfos.value.filter(info => {
        const registrationDate = new Date(info.createdAt || info.examTime);
        return registrationDate >= dayStart && registrationDate <= dayEnd;
      });
      
      return {
        date: day.toISOString().substring(0, 10),
        count: dayRegistrations.length
      };
    });
  });

  // 计算属性：考试级别分布
  const examLevelDistribution = computed(() => {
    const levels = ['四级', '六级'];
    
    return levels.map(level => {
      const count = examInfos.value.filter(info => info.examLevel === level).length;
      const label = level === '四级' ? '大学英语四级' : '大学英语六级';
      
      return { level, label, count };
    });
  });

  // 加载考点数据
  const loadExamSites = async () => {
    try {
      const res = await getExamSiteList({});
      if (res && res.code === 200) {
        // 适配后端返回的不同数据结构
        if (res.data.records && Array.isArray(res.data.records)) {
          examSites.value = res.data.records;
        } else if (res.data.items && Array.isArray(res.data.items)) {
          examSites.value = res.data.items;
        } else if (Array.isArray(res.data)) {
          examSites.value = res.data;
        } else {
          console.error('无法识别的数据格式:', res.data);
          examSites.value = [];
        }
      }
    } catch (error) {
      console.error('加载考点数据失败:', error);
    }
  };

  // 加载座位数据
  const loadExamSeats = async () => {
    try {
      const res = await getExamSeatList({});
      if (res && res.code === 200) {
        // 适配后端返回的不同数据结构
        if (res.data.records && Array.isArray(res.data.records)) {
          examSeats.value = res.data.records;
        } else if (res.data.items && Array.isArray(res.data.items)) {
          examSeats.value = res.data.items;
        } else if (Array.isArray(res.data)) {
          examSeats.value = res.data;
        } else {
          console.error('无法识别的数据格式:', res.data);
          examSeats.value = [];
        }
      }
    } catch (error) {
      console.error('加载座位数据失败:', error);
    }
  };

  // 加载考试信息数据
  const loadExamInfos = async () => {
    try {
      // 设置较大的size以获取更多数据进行分析
      const res = await getExamInfoList({ current: 1, size: 1000 });
      if (res && res.code === 200) {
        // 适配后端返回的不同数据结构
        if (res.data.records && Array.isArray(res.data.records)) {
          examInfos.value = res.data.records;
        } else if (res.data.items && Array.isArray(res.data.items)) {
          examInfos.value = res.data.items;
        } else if (Array.isArray(res.data)) {
          examInfos.value = res.data;
        } else {
          console.error('无法识别的数据格式:', res.data);
          examInfos.value = [];
        }
      }
    } catch (error) {
      console.error('加载考试信息数据失败:', error);
    }
  };

  // 加载学生数据
  const loadStudents = async () => {
    try {
      const res = await getStudentList({ current: 1, size: 1000 });
      if (res && res.code === 200) {
        // 适配后端返回的不同数据结构
        if (res.data.records && Array.isArray(res.data.records)) {
          students.value = res.data.records;
        } else if (res.data.items && Array.isArray(res.data.items)) {
          students.value = res.data.items;
        } else if (Array.isArray(res.data)) {
          students.value = res.data;
        } else {
          console.error('无法识别的数据格式:', res.data);
          students.value = [];
        }
      }
    } catch (error) {
      console.error('加载学生数据失败:', error);
    }
  };

  // 加载所有数据
  const loadAllData = async () => {
    loading.value = true;
    try {
      await Promise.all([
        loadExamSites(),
        loadExamSeats(),
        loadExamInfos(),
        loadStudents()
      ]);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      loading.value = false;
    }
  };

  // 更新日期范围
  const updateDateRange = (range: [Date, Date]) => {
    dateRange.value = range;
  };

  // 组件挂载时加载数据
  onMounted(() => {
    loadAllData();
  });

  return {
    loading,
    dateRange,
    totalExamSites,
    totalExamSeats,
    registeredStudents,
    assignedSeats,
    upcomingExams,
    cet4Count,
    cet6Count,
    examSiteUtilization,
    examTypeDistribution,
    dailyRegistrations,
    examLevelDistribution,
    loadAllData,
    updateDateRange
  };
} 