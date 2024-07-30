<script setup lang="ts">
  import { ref } from 'vue';
  import { LogListParams, LogListData, businessTypeMap } from '@/types/LogType';
  import {
    deleteControls,
    exportControlsList,
    getControlsList,
  } from '@/api/logs/operation';
  import { Message, TableRowSelection } from '@arco-design/web-vue';
  import { PageData } from '@/types/pageData';
  import { HttpResponse } from '@/api/interceptor';
  import { CalendarValue } from '@arco-design/web-vue/es/date-picker/interface';

  const datePicker = ref<any>(null);
  const formModel = ref({
    current: 1,
    pageSize: 20,
    service: null,
    operName: null,
    beginTime: null,
    endTime: null,
  } as LogListParams);
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
      title: '系统模块',
      dataIndex: 'service',
    },
    {
      title: '请求方式',
      dataIndex: 'requestMethod',
    },
    {
      title: '操作类型',
      // dataIndex: 'operatorType',
      slotName: 'businessType',
    },
    {
      title: '操作人员',
      dataIndex: 'operName',
    },
    {
      title: '操作IP',
      dataIndex: 'operIp',
    },
    {
      title: '操作时间',
      dataIndex: 'operTime',
    },
  ];

  const logListData = ref([] as LogListData[]);
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
      service: null,
      operName: null,
      beginTime: null,
      endTime: null,
    };
    fetchDate();
  };
  // 时间选择
  const dateOk = ([beginTime, endTime]: CalendarValue[]) => {
    formModel.value.beginTime = beginTime as string;
    formModel.value.endTime = endTime as string;
  };
  // 导出数据
  const exportData = () => {
    exportControlsList(formModel.value).then((res: any) => {
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
    const { msg } = await deleteControls(selectedKeys.value);
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
    getControlsList(params).then((res: HttpResponse<PageData<any>>) => {
      const { data } = res;
      logListData.value = data.records;
      pagination.value.total = data.total;
    });
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
    <Breadcrumb :items="['system.router.log', 'system.operlog.list']" />
    <a-card class="general-card" :title="$t('system.operlog.list')">
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
                <a-form-item field="service" label="系统模块">
                  <a-input
                    v-model="formModel.service as any"
                    placeholder="请输入模块名称"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item field="operName" label="操作人员">
                  <a-input
                    v-model="formModel.operName as any"
                    placeholder="请输入操作人员名称"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item field="datePicker" label="搜索日期">
                  <a-range-picker
                    v-model="datePicker"
                    style="width: 360px; margin: 0 24px 24px 0"
                    show-time
                    :time-picker-props="{
                      defaultValue: ['00:00:00', '23:59:59'],
                    }"
                    format="YYYY-MM-DD"
                    @ok="dateOk"
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
            row-key="operId"
            @page-change="tablePageChange"
          >
            <template #businessType="{ record }">
              {{ businessTypeMap.get(record.businessType) || '未知' }}
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
