export interface Dept {
  deptId: number;
  deptName: string;
  leader: string;
  orderNum: number;
  parentId: number;
  status: string;
}
export interface Role {
  admin: boolean;
  dataScope?: string;
  flag?: boolean;
  roleId: number;
  roleKey: string;
  roleName: string;
  roleSort: number;
  status: string;
}
export interface User {
  admin: boolean;
  avatar?: string;
  delFlag?: number;
  dept?: Dept;
  deptId?: number;
  email?: string;
  loginDate?: string;
  loginIp?: string;
  nickName: string;
  phonenumber?: string;
  remark?: string;
  roles: Role[];
  sex?: string;
  status?: string;
  userId: number;
  username: string;
}

export interface UserState {
  permissions: string[];
  roles: string[];
  user: User;
}
