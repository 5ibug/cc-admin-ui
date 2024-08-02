export interface SysDict {
  createBy: string;
  createTime: string;
  dictId: number;
  dictName: string;
  dictType: string;
  remark: string;
  params: object;
  status: string;
}

export interface dictParams {
  current: number;
  pageSize: number;
  dictName?: string;
  dictType?: string;
  status?: string;
}

export interface pageQueryDictParams {
  current: number;
  pageSize: number;
  dictType: string;
}

export interface SysDictData {
  createBy: string;
  createTime: string;
  cssClass: string;
  default: boolean;
  dictCode: number;
  dictLabel: string;
  dictSort: number;
  dictType: string;
  dictValue: string;
  isDefault: 'Y' | 'N';
  listClass: string;
  params: object;
  remark: string;
  status: string;
}
// 缓存的dict
export type CachedDictionary = {
  dictType: string;
  data: SysDictData[];
  timestamp: number;
};
