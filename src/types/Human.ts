import type { disabledStatus } from '@/types/global';

export interface StaffSearchParams {
  deptId: string;
  username: string;
  phonenumber: string;
  status: disabledStatus;
  beginTime?: string | null;
  endTime?: string | null;
}

export interface StaffPageListItem {
  userId: number;
  username: string;
  nickName: string;
  dept: {
    deptName: string;
  };
  phonenumber: string;
  status: disabledStatus;
  createTime: Date;
}

export interface RoleSearchParams {
  roleName: string;
  roleKey: string;
  status: disabledStatus;
}

export type roleScope = '1' | '2' | '3' | '4' | '5'; // 角色权限

export interface RolePageListItem {
  createTime: string;
  remark: string;
  params: Record<string, any>;
  roleId: number;
  roleName: string;
  roleKey: string;
  roleSort: number;
  dataScope: roleScope;
  status: disabledStatus;
  delFlag: string;
  flag: boolean;
  admin: boolean;
}
export interface RoleForm {
  dataScope: roleScope;
  deptIds: number[];
  menuIds: number[];
  remark: string;
  roleId: number;
  roleKey: string;
  roleName: string;
  roleSort: number;
  status: disabledStatus;
}

export interface DeptSearchParams {
  deptName: string | number | null;
  status: number | null;
}

export interface DeptPageListItem {
  createBy: string;
  createTime: string;
  params: Record<string, any>;
  deptId: number;
  parentId: number;
  ancestors: string;
  deptName: string;
  orderNum: number;
  leader: string;
  phone: string;
  email: string;
  status: disabledStatus;
  delFlag: string;
  children: DeptPageListItem[];
}

export interface PostPSearchParams {
  postCode: number | null;
  postName: string | null;
  status: disabledStatus;
}
export interface PostPageListItem {
  createBy: string;
  createTime: string;
  remark: string;
  params: Record<string, any>;
  postId: number;
  postCode: string;
  postName: string;
  postSort: number;
  status: disabledStatus;
  flag: boolean;
}
export interface PostForm {
  postCode: string;
  postId: number;
  postName: string;
  postSort: number;
  remark: string;
  status: disabledStatus;
}
