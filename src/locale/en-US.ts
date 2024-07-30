import localeMessageBox from '@/components/message-box/locale/en-US';
import localeLogin from '@/views/login/locale/en-US';
import localeSelectIcon from '@/components/select-icon/locale/en-US';

// import localeWorkplace from '@/views/dashboard/workplace/locale/en-US';

import localeSettings from './en-US/settings';

export default {
  'menu.dashboard': 'Dashboard',
  'menu.server.dashboard': 'Dashboard-Server',
  'menu.server.workplace': 'Workplace-Server',
  'menu.server.monitor': 'Monitor-Server',
  'menu.list': 'List',
  'menu.result': 'Result',
  'menu.exception': 'Exception',
  'menu.form': 'Form',
  'menu.profile': 'Profile',
  'menu.visualization': 'Data Visualization',
  'menu.user': 'User Center',
  'menu.user.setting': 'User Settings',
  'menu.arcoWebsite': 'Arco Design',
  'system.monitor': 'system monitor',
  'monitor.redis.query': 'cache monitor',
  'monitor.job': 'auto job',
  'system.manage': 'system manage',
  'menu.manage': 'menu manage',
  'system.dictionaries.list': 'dictionaries manage',
  'system.router.log': 'log manage',
  'system.operlog.list': 'operation log',
  'system.logininfor.list': 'login log',
  'system.monitor.list': 'job log',
  'menu.faq': 'FAQ',
  'navbar.docs': 'Docs',
  'navbar.action.locale': 'Switch to English',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeSelectIcon,
  // ...localeWorkplace,
};
