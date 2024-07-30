export interface LogListParams {
  current: number;
  pageSize: number;
  service?: number | null;
  operName: string | null;
  beginTime?: string | null;
  endTime?: string | null;
}
export interface LoginLogListParams {
  current: number;
  pageSize: number;
  ipaddr: string | null;
  userName: string | null;
}
export interface LogListData {
  params: object;
  operId: number;
  service: string;
  businessType: number;
  method: string;
  requestMethod: string;
  operatorType: number;
  operName: string;
  operUrl: string;
  operIp: string;
  operParam: string;
  jsonResult: string;
  status: number;
  operTime: string;
}

export const businessTypeMap = new Map([
  [0, '其它'],
  [1, '新增'],
  [2, '修改'],
  [3, '删除'],
  [4, '授权'],
  [5, '导出'],
  [6, '导入'],
  [7, '强退'],
  [8, '生成代码'],
  [9, '清空数据'],
]);

export interface loginLogListData {
  accessTime: string;
  infoId: number;
  ipaddr: string;
  msg: string;
  status: number;
  userName: string;
  params: object;
}

export interface JobLogListData {
  createTime: string;
  params: object;
  jobLogId: number;
  jobName: string;
  jobGroup: string;
  invokeTarget: string;
  jobMessage: string;
  status: number;
  exceptionInfo: string;
}

export interface JobLogListParams {
  current: number;
  pageSize: number;
  jobName: string | null;
  jobGroup: string | null;
}
