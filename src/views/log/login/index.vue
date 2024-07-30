<script setup lang="ts">
  import { ref } from 'vue';
  import { loginLogListData, LoginLogListParams } from '@/types/LogType';
  import { Message, TableRowSelection } from '@arco-design/web-vue';
  import {
    deleteLoginLogs,
    exportLoginLogList,
    getLoginList,
  } from '@/api/logs/login';
  import type { PageData } from '@/types/pageData';
  import { HttpResponse } from '@/api/interceptor';

  const datePicker = ref<any>(null);
  const formModel = ref({
    current: 1,
    pageSize: 20,
    ipaddr: null,
    userName: null,
  } as LoginLogListParams);
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
      title: '用户名称',
      dataIndex: 'userName',
    },
    {
      title: 'IP',
      dataIndex: 'ipaddr',
    },
    {
      title: '状态',
      slotName: 'status',
    },
    {
      title: '登录信息',
      dataIndex: 'msg',
    },
    {
      title: '登录时间',
      dataIndex: 'accessTime',
    },
  ];

  const logListData = ref([] as loginLogListData[]);
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
      ipaddr: null,
      userName: null,
    };
    fetchDate();
  };

  // 导出数据
  const exportData = () => {
    exportLoginLogList(formModel.value).then((res: any) => {
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
    const { msg } = await deleteLoginLogs(selectedKeys.value);
    Message.success(msg);
    selectedKeys.value = [];
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
    getLoginList(params).then(
      (res: HttpResponse<PageData<loginLogListData>>) => {
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
    <Breadcrumb :items="['system.router.log', 'system.logininfor.list']" />
    <a-card class="general-card" :title="$t('system.logininfor.list')">
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
                <a-form-item field="service" label="用户名称">
                  <a-input
                    v-model="formModel.userName as any"
                    placeholder="请输入用户名称"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item field="operName" label="ip地址">
                  <a-input
                    v-model="formModel.ipaddr as any"
                    placeholder="请输入IP地址"
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
            row-key="infoId"
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
