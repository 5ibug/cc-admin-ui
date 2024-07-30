<script setup lang="ts">
  import { ref } from 'vue';
  import { JobLogListData, JobLogListParams } from '@/types/LogType';
  import { Message, TableRowSelection } from '@arco-design/web-vue';
  import {
    deleteJobLogAll,
    deleteJobLogs,
    exportJobLogList,
    getJobLogList,
  } from '@/api/logs/job';
  import { HttpResponse } from '@/api/interceptor';
  import type { PageData } from '@/types/pageData';

  const datePicker = ref<any>(null);
  const formModel = ref({
    current: 1,
    pageSize: 20,
    jobName: null,
    jobGroup: null,
  } as JobLogListParams);
  // 表格选择
  const rowSelection = ref({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);
  const isSearch = ref(false);

  const selectedKeys = ref([] as number[]); // 选中的key 用于批量删除
  const columns = [
    {
      title: '任务名称',
      dataIndex: 'jobName',
    },
    {
      title: '任务组名',
      dataIndex: 'jobGroup',
    },
    {
      title: '调用目标方法',
      dataIndex: 'invokeTarget',
    },
    {
      title: '任务信息',
      dataIndex: 'jobMessage',
    },
    {
      title: '任务状态',
      slotName: 'status',
    },
    // {
    //   title: '异常信息',
    //   dataIndex: 'exceptionInfo',
    // },
    {
      title: '执行时间',
      dataIndex: 'createTime',
    },
  ];

  const logListData = ref([] as JobLogListData[]);
  const search = () => {
    isSearch.value = true;
    fetchDate();
  };

  // 分页组件
  const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const reset = () => {
    isSearch.value = false;
    datePicker.value = null;
    pagination.value.current = 1;
    formModel.value = {
      current: 1,
      pageSize: 20,
      jobName: null,
      jobGroup: null,
    };
    fetchDate();
  };

  // 导出数据
  const exportData = () => {
    exportJobLogList(formModel.value).then((res: any) => {
      // 下载文件
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob); // 创建 url 并指向 blob
      const a = document.createElement('a');
      a.href = url;
      a.download = '导出.xlsx';
      a.click();
      window.URL.revokeObjectURL(url); // 释放该 url
    });
  };
  // 批量删除
  const batchDelete = async () => {
    const { msg } = await deleteJobLogs(selectedKeys.value);
    Message.success(msg);
    selectedKeys.value = [];
    fetchDate();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const delAll = async () => {
    const { msg } = await deleteJobLogAll();
    Message.success(msg);
    fetchDate();
  };

  const tablePageChange = (page: number) => {
    formModel.value.current = page;
    pagination.value.current = page;
    fetchDate();
  };
  const fetchDate = () => {
    // 防止切换页码时携带搜索
    const params = {
      ...formModel.value,
      current: pagination.value.current,
      pageSize: pagination.value.pageSize,
    };
    getJobLogList(params).then(
      (res: HttpResponse<PageData<JobLogListData>>) => {
        const { data } = res;
        logListData.value = data.records;
        pagination.value.total = data.total;
      }
    );
  };
  fetchDate();
</script>

<script lang="ts">
  export default {
    name: 'Job',
  };
</script>

<template>
  <div class="container">
    <Breadcrumb :items="['system.router.log', 'system.monitor.list']" />
    <a-card class="general-card" :title="$t('system.monitor.list')">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="service" label="任务名称">
                  <a-input
                    v-model="formModel.jobName as any"
                    placeholder="请输入任务名称"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item field="operName" label="任务组名">
                  <a-input
                    v-model="formModel.jobGroup as any"
                    placeholder="请输入任务组名"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              搜索
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />

      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="exportData">
              <template #icon>
                <icon-download />
              </template>
              导出数据
            </a-button>

            <a-button
              type="primary"
              status="danger"
              :disabled="selectedKeys.length <= 0"
              @click="batchDelete"
            >
              <template #icon>
                <icon-plus />
              </template>
              批量删除
            </a-button>
            <!--            <a-popconfirm-->
            <!--              :content="'是否清空日志'"-->
            <!--              type="warning"-->
            <!--              @ok="() => delAll()"-->
            <!--            >-->
            <!--              <a-button type="primary" status="danger">-->
            <!--                <template #icon>-->
            <!--                  <icon-delete />-->
            <!--                </template>-->
            <!--                <template #default> 清空</template>-->
            <!--              </a-button>-->
            <!--            </a-popconfirm>-->
          </a-space>
        </a-col>
      </a-row>

      <a-row>
        <a-col :flex="1">
          <a-table
            v-model:selectedKeys="selectedKeys"
            :columns="columns"
            :data="logListData"
            :pagination="pagination"
            :row-selection="rowSelection"
            row-key="jobLogId"
            @page-change="tablePageChange"
          >
            <template #status="{ record }">
              {{ record.status === '0' ? '成功' : '失败' }}
            </template>
          </a-table>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px;

    .tableAction {
      button {
        padding: 0;
      }
    }
  }
</style>
