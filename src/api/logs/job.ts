import axios from 'axios';
import type { PageData } from '@/types/pageData';
import { HttpResponse } from '@/api/interceptor';
import {
  JobLogListData,
  JobLogListParams,
  loginLogListData,
  LoginLogListParams,
} from '@/types/LogType';

export function getJobLogList(params: JobLogListParams) {
  return axios.get<PageData<JobLogListData>>('/job/log/pageQuery', {
    params,
  });
}
export function exportJobLogList(data: JobLogListParams) {
  return axios.post(
    '/job/log/export',
    { data },
    {
      responseType: 'blob',
    }
  );
}

// 删除
export function deleteJobLogs(ids: number[]): Promise<HttpResponse> {
  // ids转字符串
  const idStr = ids.join(',');
  return axios.delete(`/job/log/${idStr}`);
}

export function deleteJobLogAll(): Promise<HttpResponse> {
  return axios.delete(`/job/log/`);
}
