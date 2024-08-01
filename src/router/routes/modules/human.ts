import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const Human: AppRouteRecordRaw = {
  path: '/human',
  name: 'human',
  component: DEFAULT_LAYOUT,
  children: [
    {
      path: 'staff',
      name: 'Staff',
      component: () => import('@/views/human/staff/index.vue'),
      meta: {
        locale: '操作日志',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'role',
      name: 'Role',
      component: () => import('@/views/human/role/index.vue'),
      meta: {
        locale: '角色管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'dept',
      name: 'Dept',
      component: () => import('@/views/human/dept/index.vue'),
      meta: {
        locale: '部门管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'post',
      name: 'Post',
      component: () => import('@/views/human/post/index.vue'),
      meta: {
        locale: '岗位管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default Human;
