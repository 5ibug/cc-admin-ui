export interface SysMenu {
  component: string;
  createTime: string;
  icon: string;
  isFrame: '0' | '1';
  menuId: number;
  menuName: string;
  menuType: 'M' | 'C' | 'F';
  orderNum: number;
  params: object;
  parentId: number;
  path: string;
  perms: string;
  routes: SysMenu[];
  status: '0' | '1';
  visible: '0' | '1';
  children?: SysMenu[];
}

export interface SysTreeMenu {
  key: number;
  title: string;
  children: SysTreeMenu[];
}

export interface SysMenuForm {
  menuId: number;
  icon: string;
  parentId: number;
  menuType: 'M' | 'C' | 'F';
  menuName: string;
  orderNum: number;
  isFrame: '0' | '1';
  perms: string;
  path: string;
  status: '0' | '1';
  visible: '0' | '1';
}

export interface checkedMenus {
  menuId: number;
  menuType: 'M' | 'C' | 'F';
  params: object;
  routes: [];
}

export interface roleMenuTreeSelect {
  checkedMenus: checkedMenus[];
  menus: SysTreeMenu[];
}
