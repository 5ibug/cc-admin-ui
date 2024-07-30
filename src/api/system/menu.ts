import axios from 'axios';
import {
  roleMenuTreeSelect,
  SysMenu,
  SysMenuForm,
  SysTreeMenu,
} from '@/types/SysMenu';

export function getMenuList(params: Record<string, any>) {
  return axios.get<SysMenu[]>('/system/menu/list', { params });
}

export function getMenuTreeList() {
  return axios.get<SysTreeMenu[]>('/system/menu/treeSelect');
}
// 获取tree列表byid
export function getMenuTreeListById(id: number | undefined) {
  return axios.get<roleMenuTreeSelect>(`/system/menu/roleMenuTreeSelect/${id}`);
}
export function addMenu(data: SysMenuForm) {
  return axios.post('/system/menu', data);
}

export function editMenu(data: SysMenuForm) {
  return axios.put('/system/menu', data);
}

export function deleteMenu(id: number) {
  return axios.delete(`/system/menu/${id}`);
}
