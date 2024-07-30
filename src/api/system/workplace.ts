// 首页的api封装

import axios from 'axios';

const service = 'system';

type ServiceCount = {
  [serviceName: string]: number;
};
export type WorkplaceData = {
  service?: ServiceCount;
  springVersion?: string;
  version?: string;
};
// eslint-disable-next-line import/prefer-default-export
export function info() {
  return axios.get<WorkplaceData>(`/${service}/index/info`);
}
