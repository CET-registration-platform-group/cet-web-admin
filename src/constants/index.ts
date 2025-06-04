// 存储键名
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  IS_LOGGED_IN: 'isLoggedIn'
};

// API 相关配置
export const API_CONFIG = {
  // 添加API前缀
  BASE_URL: '/api',
  TIMEOUT: import.meta.env.VITE_API_TIMEOUT ? Number(import.meta.env.VITE_API_TIMEOUT) : 10000, // 从环境变量加载超时时间
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
  DASHBOARD: '/dashboard',
  EXAM_SITES: '/exam-sites',
  EXAM_ROOMS: '/exam-rooms',
  EXAM_SEATS: '/exam-seats',
  EXAM_INFO: '/exam-info',
  STUDENTS: '/students',
  DATA_ANALYSIS: '/data-analysis'
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