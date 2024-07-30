import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';
import localeSelectIcon from '@/components/select-icon/locale/zh-CN';

// import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';

import localeSettings from './zh-CN/settings';

export default {
  'menu.dashboard': '仪表盘',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'menu.user.setting': '用户设置',
  'menu.arcoWebsite': 'Arco Design',
  'system.monitor': '系统监控',
  'monitor.redis.query': '缓存监控',
  'monitor.job': '定时任务',
  'system.manage': '系统管理',
  'menu.manage': '菜单管理',
  'system.dictionaries.list': '字典管理',
  'system.router.log': '日志管理',
  'system.operlog.list': '操作日志',
  'system.logininfor.list': '登录日志',
  'system.monitor.list': '定时任务日志',
  'menu.faq': '常见问题',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeSelectIcon,
  // ...localeWorkplace,
};
