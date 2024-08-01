<script setup lang="ts">
  import { ref } from 'vue';
  import { DeptSearchParams, DeptPageListItem } from '@/types/Human';
  import { TableRowSelection } from '@arco-design/web-vue';

  const listData = ref([] as DeptPageListItem[]);
  const selectedKeys = ref([]);
  const formModel = ref({} as DeptSearchParams);

  const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const rowSelection = ref({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

  const columns = [
    {
      title: '部门名称',
      dataIndex: 'userId',
    },
    {
      title: '排序',
      dataIndex: 'nickName',
    },
    {
      title: '状态',
      dataIndex: 'statusSlot',
    },
    {
      title: '创建时间',
      slotName: 'createTime',
    },
    {
      title: '操作',
      slotName: 'actionSlot',
    },
  ];

  // 获取数据
  const fetchData = async () => {
    // const { data } = await getDictList({
    //   ...formModel.value,
    //   current: pagination.value.current,
    //   pageSize: pagination.value.pageSize,
    // });
    // listData.value = data.records;
    // pagination.value.total = data.total;
  };

  const search = () => {
    pagination.value.current = 1;
    fetchData();
  };

  const reset = () => {
    formModel.value = {
      deptName: null,
      status: null,
    } as DeptSearchParams;
    pagination.value.current = 1;
    fetchData();
  };
  const pageSizeChange = (pageSize: number) => {
    pagination.value.pageSize = pageSize;
    fetchData();
  };

  const pageChanage = (current: number) => {
    pagination.value.current = current;
    fetchData();
  };
  const create = () => {};
  const addDept = () => {};
  const editDept = (record: DeptPageListItem) => {};
  const deleteDept = (record: DeptPageListItem) => {};
</script>

<template>
  <div class="container">
    <Breadcrumb :items="['human.manage', 'human.staff.list']" />
    <a-card class="general-card" title="职员管理">
      <a-row>
        <a-col :flex="1" :model="formModel">
          <a-form
            v-model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="dictName" label="部门名称">
                  <a-input
                    v-model="formModel.deptName"
                    placeholder="请输入用户账号"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="dictType" label="排序">
                  <a-input
                    v-model="formModel.status"
                    placeholder="请输入用户账号"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" label="状态">
                  <a-select
                    v-model="formModel.status"
                    placeholder="选择状态"
                    allow-clear
                  >
                    <a-option>正常</a-option>
                    <a-option>停用</a-option>
                  </a-select>
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
            <a-button type="primary" @click="create">
              <template #icon>
                <icon-plus />
              </template>
              新建
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-table
        v-model:selectedKeys="selectedKeys"
        :columns="columns"
        :data="listData"
        :row-selection="rowSelection"
        row-key="dictId"
        :pagination="pagination"
        @page-size-change="pageSizeChange"
        @page-change="pageChanage"
      >
        <template #statusSlot="{ record }">
          <a-tag v-if="record.status == 0" color="#00b42a"> 启用</a-tag>
          <a-tag v-else color="#86909c"> 禁用</a-tag>
        </template>
        <template #actionSlot="{ record }">
          <a-space>
            <a-button @click="() => addDept()"> 新增</a-button>
          </a-space>
          <a-space>
            <a-button @click="() => editDept(record)"> 修改</a-button>
          </a-space>
          <a-space>
            <a-button @click="() => deleteDept(record)"> 删除</a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px;
  }
</style>
