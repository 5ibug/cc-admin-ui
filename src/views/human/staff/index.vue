<script setup lang="ts">
  import { ref } from 'vue';
  import { StaffSearchParams, StaffPageListItem } from '@/types/Human';
  import { SysDict } from '@/types/SysDict';
  import { TableRowSelection } from '@arco-design/web-vue';
  import { CalendarValue } from '@arco-design/web-vue/es/date-picker/interface';

  const datePicker = ref<any>(null);
  const listData = ref([] as StaffPageListItem[]);
  const deptTree = ref([]);
  const selectedKeys = ref([]);
  const formModel = ref({
    deptId: '',
    username: '',
    phonenumber: '',
    status: '',
    beginTime: null,
    endTime: null,
  } as StaffSearchParams);

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
      title: '用户账号',
      dataIndex: 'userId',
    },
    {
      title: '用户昵称',
      dataIndex: 'nickName',
    },
    {
      title: '部门',
      dataIndex: 'deptName',
    },
    {
      title: '手机号码',
      dataIndex: 'phonenumber',
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
      username: '',
      phonenumber: '',
      status: '',
    } as StaffSearchParams;
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
  // 时间选择
  const dateOk = ([beginTime, endTime]: CalendarValue[]) => {
    formModel.value.beginTime = beginTime as string;
    formModel.value.endTime = endTime as string;
  };
  const exportData = () => {};
  const importData = () => {};
  const create = () => {};
  const batchDelete = () => {};
  const editStaff = (record: StaffPageListItem) => {};
  const deleteStaff = (record: StaffPageListItem) => {};
  const resetStaffPwd = (record: StaffPageListItem) => {};
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
                <a-form-item field="dictName" label="部门">
                  <a-cascader
                    v-model="formModel.deptId"
                    :options="deptTree"
                    placeholder="选择部门"
                    allow-clear
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item field="dictType" label="用户账号">
                  <a-input
                    v-model="formModel.username"
                    placeholder="请输入用户账号"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item field="phonenumber" label="手机号码">
                  <a-input
                    v-model="formModel.phonenumber"
                    placeholder="请输入手机号码"
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
              <a-col :span="8">
                <a-form-item field="createTime" label="创建时间">
                  <a-range-picker
                    v-model="datePicker"
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
            <a-button type="primary" @click="create">
              <template #icon>
                <icon-plus />
              </template>
              新建
            </a-button>

            <a-button
              type="primary"
              status="danger"
              :disabled="selectedKeys.length <= 0"
              @click="batchDelete"
            >
              <template #icon>
                <icon-delete />
              </template>
              批量删除
            </a-button>

            <a-popconfirm
              :content="'是否导出数据?'"
              type="warning"
              @ok="exportData"
            >
              <a-button type="primary">
                <template #icon>
                  <icon-export />
                </template>
                导出数据
              </a-button>
            </a-popconfirm>

            <a-button type="outline" @click="importData">
              <template #icon>
                <icon-download />
              </template>
              导入数据
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
            <a-button @click="() => editStaff(record)"> 修改</a-button>
          </a-space>
          <a-space>
            <a-button @click="() => deleteStaff(record)"> 删除</a-button>
          </a-space>
          <a-space>
            <a-button @click="() => resetStaffPwd(record)"> 重置密码</a-button>
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
