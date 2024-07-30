import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const Access: AppRouteRecordRaw = {
  path: '/account',
  name: 'account',
  component: DEFAULT_LAYOUT,
  children: [
    {
      path: 'setting',
      name: 'Setting',
      component: () => import('@/views/account/setting/index.vue'),
      meta: {
        locale: '用户设置',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default Access;
