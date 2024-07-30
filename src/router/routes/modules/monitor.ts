import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const Monitor: AppRouteRecordRaw = {
  path: '/monitor',
  name: 'monitor',
  component: DEFAULT_LAYOUT,
  children: [
    {
      path: 'redis',
      name: 'redis',
      component: () => import('@/views/monitor/redis/index.vue'),
      meta: {
        locale: '缓存管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'job',
      name: 'job',
      component: () => import('@/views/monitor/job/index.vue'),
      meta: {
        locale: '定时任务管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default Monitor;
