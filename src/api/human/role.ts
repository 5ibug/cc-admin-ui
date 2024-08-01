import axios from 'axios';
import { PageData } from '@/types/pageData';
import { HttpResponse } from '@/api/interceptor';

// 请求的控制器名称
const controller = 'system/role';

/**
 * 获取分页
 * @param params 搜索参数
 */
export async function pageQuery(
  params: Record<string, any>
): Promise<HttpResponse> {
  return axios.get(`${controller}/pageQuery`, params);
}
/**
 * 新增角色
 * @param params 搜索参数
 */
export async function add(params: Record<string, any>): Promise<HttpResponse> {
  return axios.post(controller, params);
}

/**
 * 删除角色
 * @param params 搜索参数
 */
export async function remove(ids: number[]): Promise<HttpResponse> {
  // ids转字符串
  const idStr = ids.join(',');
  return axios.delete(`${controller}/${idStr}`);
}

/**
 * 编辑角色
 * @param params 搜索参数
 */
export async function edit(params: Record<string, any>): Promise<HttpResponse> {
  return axios.put(controller, params);
}
