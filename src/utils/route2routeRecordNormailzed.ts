import { Router } from '@/types/routers';
import { RouteRecordNormalized } from 'vue-router';

function transformRouterToRouteRecordNormalized(
  data: Router
): RouteRecordNormalized {
  const route: RouteRecordNormalized = {
    path: data.path,
    name: data.name,
    meta: {
      locale: data.meta.title,
      requiresAuth: true,
      icon: data.icon ?? undefined,
      hideInMenu: data.hidden,
    },
    children: data.routes?.map(transformRouterToRouteRecordNormalized) || [],
  } as any;

  // 删除未定义的属性
  Object.keys(route).forEach(
    (key) => (route as any)[key] === undefined && delete (route as any)[key]
  );
  return route;
}

export default function (router: Router[]): RouteRecordNormalized[] {
  // 追加用户设置路由
  router.push({
    name: '用户设置',
    path: '/account/setting',
    hidden: true,
    component: 'Layout',
    meta: {
      title: '用户设置',
    },
  } as Router);

  return router.map(transformRouterToRouteRecordNormalized);
}
