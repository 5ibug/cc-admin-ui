import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LOG: AppRouteRecordRaw = {
  path: '/log',
  name: 'log',
  component: DEFAULT_LAYOUT,
  children: [
    {
      path: 'operation',
      name: 'operation',
      component: () => import('@/views/log/operation/index.vue'),
      meta: {
        locale: '操作日志',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'login',
      name: 'loginLog',
      component: () => import('@/views/log/login/index.vue'),
      meta: {
        locale: '登录日志',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'job',
      name: 'jobLog',
      component: () => import('@/views/log/job/index.vue'),
      meta: {
        locale: '定时任务日志',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default LOG;
