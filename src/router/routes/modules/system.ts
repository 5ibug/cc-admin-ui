import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const System: AppRouteRecordRaw = {
  path: '/system',
  name: 'system',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.dashboard',
    requiresAuth: true,
    icon: 'icon-dashboard',
    order: 0,
  },
  children: [
    {
      path: 'menu',
      name: 'MENU',
      component: () => import('@/views/system/menu/index.vue'),
      meta: {
        locale: '菜单管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'dictionaries',
      name: 'Dictionaries',
      component: () => import('@/views/system/dictionaries/index.vue'),
      meta: {
        locale: '字典管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'dfs',
      name: 'Dfs',
      component: () => import('@/views/system/dfs/index.vue'),
      meta: {
        locale: '文件管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'client',
      name: 'Client',
      component: () => import('@/views/system/client/index.vue'),
      meta: {
        locale: 'Oauth2管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default System;
