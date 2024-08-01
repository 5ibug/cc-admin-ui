import { Ref, ref } from 'vue';
import { proTableParam } from '@/components/ProTable/types/proTable';
import { TableColumnData } from '@arco-design/web-vue';
import { PageParams } from '@/types/SystemClient';

const useProTable = (config: {
  searchParam?: proTableParam[]; // 搜索表单
  api?: (...args: any[]) => Promise<any>; // 搜索方法
  edit?: (...args: any[]) => Promise<any>; // 搜索方法
  remove?: (...args: any[]) => Promise<any>; // 搜索方法
  add?: (...args: any[]) => Promise<any>; // 搜索方法
  columns?: (TableColumnData & {
    hidden?: boolean;
    type?: string;
    dictType?: string;
  })[];
  // 具体方法相关, 如删除等.
  editButton?: boolean;
  addButton?: boolean;
  deleteButton?: boolean;
  primaryKey?: string;
}) => {
  // 处理默认值
  config = {
    ...{
      editButton: true,
      addButton: true,
      deleteButton: true,
      primaryKey: 'id',
    },
    ...config,
  };
  // 表单实际值
  const formModel = ref<{ [key: string]: any }>({});

  // 分页器相关
  const pagination = ref({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  // 表格数据
  const tableData = ref();

  // 初始化表单值
  const initFormModel = () => {
    if (config.searchParam) {
      config.searchParam.forEach((item) => {
        formModel.value[item.field] = item.defaultValue || '';
      });
    } else {
      throw new Error('searchParam');
    }
  };
  // 获取数据
  const getData = (param: Record<string, any> = {}) => {
    if (config.api) {
      config
        .api({
          ...{
            current: pagination.value.current,
            pageSize: pagination.value.pageSize,
          },
          ...formModel.value,
          ...param,
        })
        .then((res: any) => {
          tableData.value = res.data.records;
          pagination.value.total = res.data.total + 999;
        });
    } else {
      throw new Error('没有传API');
    }
  };

  // 清空搜索表单
  const reset = () => {
    pagination.value.current = 1;
    initFormModel();
    getData();
  };

  // 搜索方法
  const search = () => {
    pagination.value.current = 1;
    getData();
  };

  // 分页器事件
  const tablePageChange = (page: number) => {
    pagination.value.current = page;
    getData();
  };

  // 参数通过这个传给组件
  const register = (e: Ref) => {
    e.value = {
      searchParam: config.searchParam,
      formModel,
      initFormModel,
      reset,
      search,
      columns: config.columns,
      tableData,
      pagination,
      tablePageChange,
      config,
    };
  };
  // 初始化
  initFormModel();
  getData();
  return [
    register,
    {
      // 获取数据, 可以自定义传参, 可以覆盖前面的
      getData,
    },
  ];
};

export default useProTable;
