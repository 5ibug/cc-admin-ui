import axios from 'axios';
import type { PageData } from '@/types/pageData';
import type {
  JobListParams,
  editStatusParams,
  runJobParams,
  JobListData,
} from '@/types/JobCornType';
import { HttpResponse } from '@/api/interceptor';

export function getCronPage(params: JobListParams) {
  return axios.get<PageData<any>>('/job/cron/pageQuery', { params });
}

export function editStatus(data: editStatusParams): Promise<HttpResponse> {
  return axios.put('/job/cron/changeStatus', data);
}

export function runCronJob(data: runJobParams): Promise<HttpResponse> {
  return axios.put('/job/cron/run', data);
}

export function getJobDetails(jobId: number) {
  return axios.get<JobListData>(`/job/cron/${jobId}`);
}

// 删除, 一个和批量 批量就是逗号分割
export function deleteJobs(
  jobIds: number | string | number[]
): Promise<HttpResponse> {
  if (Array.isArray(jobIds)) {
    jobIds = jobIds.join(',');
  }
  return axios.delete(`/job/cron/${jobIds}`);
}

export function addCron(data: JobListData): Promise<HttpResponse> {
  return axios.post('/job/cron', data);
}

export function putCron(data: JobListData): Promise<HttpResponse> {
  return axios.put('/job/cron', data);
}
