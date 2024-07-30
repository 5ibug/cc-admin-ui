import axios from 'axios';
import type { PageData } from '@/types/pageData';
import { HttpResponse } from '@/api/interceptor';
import { loginLogListData, LoginLogListParams } from '@/types/LogType';

export function getLoginList(params: LoginLogListParams) {
  return axios.get<PageData<loginLogListData>>('/system/loginInfo/pageQuery', {
    params,
  });
}
export function exportLoginLogList(data: LoginLogListParams) {
  return axios.post(
    '/system/loginInfo/export',
    { data },
    {
      responseType: 'blob',
    }
  );
}

// 删除
export function deleteLoginLogs(ids: number[]): Promise<HttpResponse> {
  // ids转字符串
  const idStr = ids.join(',');
  return axios.delete(`/system/loginInfo/${idStr}`);
}
