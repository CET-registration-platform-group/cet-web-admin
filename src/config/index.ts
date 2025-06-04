interface Config {
  // 基础配置
  baseUrl: string
  appTitle: string
  appEnv: string
  useMock: boolean
  useDevTools: boolean
  
  // API 配置
  api: {
    timeout: number
    retry: number
    retryDelay: number
    baseUrl: string
    wsUrl: string
  }
  
  // 路由配置
  router: {
    base: string
    mode: 'hash' | 'history'
  }
  
  // 主题配置
  theme: {
    primaryColor: string
    darkMode: boolean
  }
  
  // 缓存配置
  storage: {
    prefix: string
    expire: number
  }
  
  // 权限配置
  permission: {
    enableDynamicRoutes: boolean
    enableRoles: boolean
  }
}

const config: Config = {
  // 基础配置
  baseUrl: import.meta.env.VITE_API_BASE_URL as string || 'http://localhost:8080',
  appTitle: import.meta.env.VITE_APP_TITLE as string || 'CET报名管理系统',
  appEnv: import.meta.env.VITE_APP_ENV as string || 'development',
  useMock: import.meta.env.VITE_USE_MOCK === 'true',
  useDevTools: import.meta.env.VITE_USE_DEVTOOLS === 'true',
  
  // API 配置
  api: {
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
    retry: Number(import.meta.env.VITE_API_RETRY) || 3,
    retryDelay: Number(import.meta.env.VITE_API_RETRY_DELAY) || 1000,
    baseUrl: import.meta.env.VITE_API_BASE_URL as string || 'http://localhost:8080',
    wsUrl: import.meta.env.VITE_API_WS_URL as string || 'ws://localhost:8080'
  },
  
  // 路由配置
  router: {
    base: import.meta.env.VITE_APP_BASE_URL as string || '/',
    mode: 'history'
  },
  
  // 主题配置
  theme: {
    primaryColor: import.meta.env.VITE_THEME_PRIMARY_COLOR as string || '#409EFF',
    darkMode: import.meta.env.VITE_THEME_DARK_MODE === 'true'
  },
  
  // 缓存配置
  storage: {
    prefix: import.meta.env.VITE_STORAGE_PREFIX as string || 'cet_exam_',
    expire: Number(import.meta.env.VITE_STORAGE_EXPIRE) || 7 * 24 * 60 * 60 * 1000
  },
  
  // 权限配置
  permission: {
    enableDynamicRoutes: import.meta.env.VITE_USE_DYNAMIC_ROUTES === 'true',
    enableRoles: import.meta.env.VITE_USE_ROLES === 'true'
  }
}

export default config 