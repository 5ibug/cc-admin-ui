import axios from 'axios';
import type { PageData } from '@/types/pageData';
import type { LogListParams } from '@/types/LogType';
import { HttpResponse } from '@/api/interceptor';

export function getControlsList(params: LogListParams) {
  return axios.get<PageData<any>>('/system/operationLog/pageQuery', { params });
}
export function exportControlsList(data: LogListParams) {
  return axios.post(
    '/system/operationLog/export',
    { data },
    {
      responseType: 'blob',
    }
  );
}

// 删除
export function deleteControls(ids: number[]): Promise<HttpResponse> {
  // ids转字符串
  const idStr = ids.join(',');
  return axios.delete(`/system/operationLog/${idStr}`);
}
