import { createRouter, createWebHistory } from 'vue-router'
import authUtils from '@/utils/auth'
import { ROUTE_PATHS, ROUTE_NAMES, STORAGE_KEYS } from '@/constants/api'

// 扩展Vue Router的RouteMeta接口
declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    requiresAuth?: boolean;
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: ROUTE_PATHS.ROOT,
      redirect: ROUTE_PATHS.AUTH
    },
    {
      path: ROUTE_PATHS.AUTH,
      name: ROUTE_NAMES.AUTH,
      component: () => import('../views/Auth.vue'),
      meta: { title: '登录/注册', requiresAuth: false }
    },
    {
      path: '/main',
      component: () => import('../layouts/MainLayout.vue'),
      redirect: ROUTE_PATHS.DASHBOARD,
      children: [
        {
          path: ROUTE_PATHS.DASHBOARD,
          name: ROUTE_NAMES.DASHBOARD,
          component: () => import('../views/Dashboard.vue'),
          meta: { title: '首页', requiresAuth: true }
        },
        // 用户管理
        {
          path: ROUTE_PATHS.USERS,
          name: ROUTE_NAMES.USERS,
          component: () => import('../views/user/Users.vue'),
          meta: { title: '用户管理', requiresAuth: true }
        },
        // 考点管理
        {
          path: ROUTE_PATHS.EXAM_SITES,
          name: ROUTE_NAMES.EXAM_SITES,
          component: () => import('../views/exam/ExamSites.vue'),
          meta: { title: '考点管理', requiresAuth: true }
        },
        // 考场管理
        {
          path: ROUTE_PATHS.EXAM_ROOMS,
          name: ROUTE_NAMES.EXAM_ROOMS,
          component: () => import('../views/exam/ExamRooms.vue'),
          meta: { title: '考场管理', requiresAuth: true }
        },
        // 座位管理
        {
          path: ROUTE_PATHS.EXAM_SEATS,
          name: ROUTE_NAMES.EXAM_SEATS,
          component: () => import('../views/exam/ExamSeats.vue'),
          meta: { title: '考试座位管理', requiresAuth: true }
        },
        // 考试信息管理
        {
          path: ROUTE_PATHS.EXAM_INFOS,
          name: ROUTE_NAMES.EXAM_INFOS,
          component: () => import('../views/exam/ExamInfos.vue'),
          meta: { title: '考试信息管理', requiresAuth: true }
        },
        // 报名信息管理
        {
          path: ROUTE_PATHS.REGISTRATION_INFOS,
          name: ROUTE_NAMES.REGISTRATION_INFOS,
          component: () => import('../views/registration/RegistrationInfos.vue'),
          meta: { title: '报名信息管理', requiresAuth: true }
        },
        // 学生管理
        {
          path: ROUTE_PATHS.STUDENTS,
          name: ROUTE_NAMES.STUDENTS,
          component: () => import('../views/student/Students.vue'),
          meta: { title: '学生管理', requiresAuth: true }
        }
      ]
    },
    // 404页面
    {
      path: '/:pathMatch(.*)*',
      name: ROUTE_NAMES.NOT_FOUND,
      component: () => import('../views/NotFound.vue'),
      meta: { title: '页面不存在', requiresAuth: false }
    }
  ]
})

// 添加全局前置守卫，处理认证和授权
router.beforeEach((to, from, next) => {
  // 判断页面是否需要认证
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false);
  
  // 使用认证工具检查登录状态
  const isAuthenticated = authUtils.checkIsLoggedIn();
  
  // 处理根路径
  if (to.path === ROUTE_PATHS.ROOT) {
    next(ROUTE_PATHS.AUTH);
    return;
  }
  
  // 如果需要认证但未认证，重定向到登录页
  if (requiresAuth && !isAuthenticated) {
    next(ROUTE_PATHS.AUTH);
    return;
  }
  
  // 如果已认证但访问登录页，重定向到首页
  if (isAuthenticated && to.path === ROUTE_PATHS.AUTH) {
    next(ROUTE_PATHS.DASHBOARD);
    return;
  }
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - CET报名管理系统`;
  } else {
    document.title = 'CET报名管理系统';
  }
  
  // 允许访问请求的页面
  next();
});

export default router