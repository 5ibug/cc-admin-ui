import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const AI: AppRouteRecordRaw = {
  path: '/ai',
  name: 'ai',
  component: DEFAULT_LAYOUT,
  children: [
    {
      path: 'chat',
      name: 'chat',
      component: () => import('@/views/ai/chat/index.vue'),
      meta: {
        locale: 'ai对话',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default AI;
