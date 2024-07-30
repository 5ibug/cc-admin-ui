import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';
import { Router } from '@/types/routers';
import type { HttpResponse } from '@/api/interceptor';

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  access_token: string;
}
export function login(data: LoginData) {
  // 计算oauth的basic,通过header携带
  const clientId = import.meta.env.VITE_OAUTH2_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_OAUTH2_CLIENT_SECRET;
  // basic
  const basic = btoa(`${clientId}:${clientSecret}`);
  // 用户名密码通过url传
  return axios.post<LoginRes>(
    `/auth/oauth2/token?grant_type=password&username=${data.username}&password=${data.password}`,
    null,
    { headers: { Authorization: `Basic ${basic}` } }
  );
}

export function logout() {
  return axios.delete<LoginRes>('/auth/token/logout');
}

export function getUserInfo() {
  return axios.get<UserState>('/system/user/getInfo');
}

export function getMenuList() {
  return axios.get<Router[]>('/system/menu/getRouters');
}

// 设置头像 formData  avatarFile
export function setAvatar(data: FormData, config?: any) {
  return axios.post('/system/user/profile/avatar', data, config);
}

// 修改当前登录的用户信息
export function updateUserInfo(data: any): Promise<HttpResponse> {
  return axios.put('/system/user/profile', data);
}

// 修改密码
export function updatePassword(data: any): Promise<HttpResponse> {
  return axios.put('/system/user/profile/updatePwd', data);
}
