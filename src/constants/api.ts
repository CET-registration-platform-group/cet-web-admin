// 存储键名
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER_INFO: 'userInfo',
  IS_LOGGED_IN: 'isLoggedIn'
};

// API 相关配置
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL ,
  TIMEOUT: import.meta.env.VITE_API_TIMEOUT ? Number(import.meta.env.VITE_API_TIMEOUT) : 10000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json'
  }
};

// 响应码
export const RESPONSE_CODE = {
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

// 路由名称
export const ROUTE_NAMES = {
  AUTH: 'auth',
  DASHBOARD: 'dashboard',
  USERS: 'users',
  EXAM_SITES: 'exam-sites',
  EXAM_ROOMS: 'exam-rooms',
  EXAM_SEATS: 'exam-seats',
  EXAM_INFO: 'exam-info',
  STUDENTS: 'students',
  DATA_ANALYSIS: 'data-analysis',
  NOT_FOUND: 'not-found'
};

// 路由路径
export const ROUTE_PATHS = {
  ROOT: '/',
  AUTH: '/auth',
  DASHBOARD: '/main/dashboard',
  USERS: '/main/users',
  EXAM_SITES: '/main/exam-sites',
  EXAM_ROOMS: '/main/exam-rooms',
  EXAM_SEATS: '/main/exam-seats',
  EXAM_INFO: '/main/exam-info',
  STUDENTS: '/main/students',
  DATA_ANALYSIS: '/main/data-analysis'
};

// 考点状态
export const EXAM_SITE_STATUS = {
  ACTIVE: 'active',
  MAINTENANCE: 'maintenance',
  CLOSED: 'closed'
};

// 考试座位状态
export const EXAM_SEAT_STATUS = {
  AVAILABLE: 0, // 未占用
  OCCUPIED: 1   // 已占用
};

// 考试类型
export const EXAM_TYPE = {
  WRITTEN: '笔试',
  ORAL: '口试'
};

// 考试级别
export const EXAM_LEVEL = {
  CET4: '四级',
  CET6: '六级'
};

// 证件类型
export const ID_DOCUMENT_TYPE = {
  ID_CARD: 0, // 身份证
  PASSPORT: 1 // 护照
};

// API路径常量
export const API_PATHS = {
  // 后台管理接口
  ADMIN: {
    // 认证相关
    AUTH: {
      LOGIN: '/api/admin/auth/login',
      LOGOUT: '/api/admin/auth/logout',
      REFRESH_TOKEN: '/api/admin/auth/refresh-token'
    },
    // 用户管理
    USERS: {
      LIST: '/api/admin/users',
      CREATE: '/api/admin/users',
      UPDATE: '/api/admin/users',
      DELETE: (id: number) => `/api/admin/users/${id}`,
      DETAIL: (id: number) => `/api/admin/users/${id}`
    },
    // 学生管理
    STUDENTS: {
      LIST: '/api/admin/students',
      CREATE: '/api/admin/students',
      UPDATE: '/api/admin/students',
      DELETE: (id: number) => `/api/admin/students/${id}`,
      DETAIL: (id: number) => `/api/admin/students/${id}`
    },
    // 考点管理
    EXAM_SITES: {
      LIST: '/api/admin/exam-sites',
      CREATE: '/api/admin/exam-sites',
      UPDATE: '/api/admin/exam-sites',
      DELETE: (id: number) => `/api/admin/exam-sites/${id}`,
      DETAIL: (id: number) => `/api/admin/exam-sites/${id}`,
      LIST_ALL: '/api/admin/exam-sites/list'
    },
    // 考场管理
    EXAM_ROOMS: {
      LIST: '/api/admin/exam-rooms',
      CREATE: '/api/admin/exam-rooms',
      UPDATE: '/api/admin/exam-rooms',
      DELETE: (id: number) => `/api/admin/exam-rooms/${id}`,
      DETAIL: (id: number) => `/api/admin/exam-rooms/${id}`,
      LIST_ALL: '/api/admin/exam-rooms/list'
    },
    // 座位管理
    EXAM_SEATS: {
      LIST: '/api/admin/exam-seats',
      CREATE: '/api/admin/exam-seats',
      UPDATE: '/api/admin/exam-seats',
      DELETE: (id: number) => `/api/admin/exam-seats/${id}`,
      DETAIL: (id: number) => `/api/admin/exam-seats/${id}`,
      LIST_ALL: '/api/admin/exam-seats/list',
      BATCH_CREATE: '/api/admin/exam-seats/batch'
    },
    // 考试信息管理
    EXAM_INFOS: {
      LIST: '/api/admin/exam-infos',
      CREATE: '/api/admin/exam-infos',
      UPDATE: '/api/admin/exam-infos',
      DELETE: (id: number) => `/api/admin/exam-infos/${id}`,
      DETAIL: (id: number) => `/api/admin/exam-infos/${id}`
    },
    // 报名信息管理
    REGISTRATION: {
      LIST: '/api/admin/registration-infos',
      CREATE: '/api/admin/registration-infos',
      UPDATE: '/api/admin/registration-infos',
      DELETE: (id: number) => `/api/admin/registration-infos/${id}`,
      DETAIL: (id: number) => `/api/admin/registration-infos/${id}`,
      RESET: (studentId: number) => `/api/admin/registration-infos/reset/${studentId}`
    },
    // 数据分析
    DATA_ANALYSIS: {
      OVERVIEW: '/api/admin/data-analysis/overview',
      EXAM_SITES: '/api/admin/data-analysis/exam-sites',
      EXAM_ROOMS: '/api/admin/data-analysis/exam-rooms',
      EXAM_SEATS: '/api/admin/data-analysis/exam-seats',
      EXAM_INFO: '/api/admin/data-analysis/exam-info',
      STUDENTS: '/api/admin/data-analysis/students'
    }
  },
  // 前台接口
  FRONT: {
    // 学生相关接口
    STUDENTS: {
      LIST: '/api/students',
      CREATE: '/api/students',
      UPDATE: '/api/students',
      DELETE: (id: number) => `/api/students/${id}`,
      DETAIL: (id: number) => `/api/students/${id}`
    }
  }
} as const;

// 分页相关常量
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_SIZES = [10, 20, 50, 100]; 