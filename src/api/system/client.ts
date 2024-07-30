import axios from 'axios';
import { HttpResponse } from '@/api/interceptor';
import { PageData } from '@/types/pageData';

// 请求的控制器名称
const controller = '/system/client';

/**
 * 新增终端
 * @param params 搜索参数
 */
export async function insert(params: Record<string, any>) {
  return axios.post(controller, params);
}

/**
 * 删除
 * @param clinets
 */
export async function remove(clinets: (string | number)[] | string) {
  return axios.delete(`${controller}/${clinets}`);
}

/**
 * 修改菜单
 * @param params 搜索参数
 */
export async function update(params: Record<string, any>) {
  return axios.put(controller, params);
}

/**
 * 获取分页 Data
 * @param params 搜索参数
 */
export async function pageQuery(params: Record<string, any>) {
  return axios.get(`${controller}/pageQuery`, { params });
}

/**
 * 获取指定终端信息
 * @param clinet
 */
export async function getByClientId(clinet: number) {
  return axios.get(`${controller}/${clinet}`);
}
