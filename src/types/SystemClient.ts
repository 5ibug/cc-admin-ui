/**
 * 状态参数
 */
export type State = {
  pageSize: number;
};

/**
 * 搜索参数
 */
export type PageParams = {
  current: number;
  pageSize: number;
  clientId: string;
};

/**
 * 响应参数
 */
export type PageListItem = {
  clientId: number;
  scope: string;
  authorizedGrantTypes: string;
  accessTokenValidity: string;
  refreshTokenValidity: string;
};
