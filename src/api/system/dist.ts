import axios from 'axios';
import { HttpResponse } from '@/api/interceptor';
import { PageData } from '@/types/pageData';
import {
  dictParams,
  pageQueryDictParams,
  SysDict,
  SysDictData,
} from '@/types/SysDict';

export function getDictList(params: dictParams) {
  return axios.get<PageData<SysDict>>('/system/dictionaries/type/pageQuery', {
    params,
  });
}

export function clearCache(): Promise<HttpResponse> {
  return axios.delete('/system/dictionaries/type/clearCache');
}

export function addDict(data: SysDict): Promise<HttpResponse> {
  return axios.post('/system/dictionaries/type', data);
}

export function putDict(data: SysDict): Promise<HttpResponse> {
  return axios.put('/system/dictionaries/type', data);
}

export function deleteDict(data: string | string[]): Promise<HttpResponse> {
  if (Array.isArray(data)) {
    // 逗号分割
    data = data.join(',');
  }
  return axios.delete(`/system/dictionaries/type/${data}`);
}

// 数据管理
export function pageQueryDict(params: pageQueryDictParams) {
  return axios.get<PageData<SysDictData>>(
    '/system/dictionaries/data/pageQuery',
    {
      params,
    }
  );
}

// 添加数据
export function addDictData(data: SysDictData): Promise<HttpResponse> {
  return axios.post('/system/dictionaries/data', data);
}

// 编辑数据
export function putDictData(data: SysDictData): Promise<HttpResponse> {
  return axios.put('/system/dictionaries/data', data);
}

// 删除字典数据
export function deleteDictData(data: string | string[]): Promise<HttpResponse> {
  if (Array.isArray(data)) {
    // 逗号分割
    data = data.join(',');
  }
  return axios.delete(`/system/dictionaries/data/${data}`);
}

// 获取字典type数据
export function getDictDataType(name: string) {
  return axios.get<SysDictData[]>(`/system/dictionaries/data/type/${name}`);
}
