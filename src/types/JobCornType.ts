export interface JobListParams {
  current?: number;
  pageSize?: number;
  jobName: string | null;
  jobGroup: string | null;
  status: string | null;
}

export interface JobListData {
  concurrent: string;
  createBy: string;
  createTime: string;
  cronExpression: string;
  invokeTarget: string;
  jobGroup: string;
  jobId: number;
  jobName: string;
  misfirePolicy: string;
  nextValidTime: string;
  params: object;
  remark: string;
  status: string;
}

export interface editStatusParams {
  jobId: number;
  status: string;
}
export interface runJobParams {
  jobId: number;
  jobGroup: string;
}
