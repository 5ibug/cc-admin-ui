<template>
  <div class="container">
    <Breadcrumb :items="['system.manage', 'system.dictionaries.list']" />
    <a-card class="general-card" title="字典管理">
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
                <a-form-item field="dictName" label="字典名称">
                  <a-input
                    v-model="formModel.dictName"
                    placeholder="请输入字典名称"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item field="dictType" label="字典类型">
                  <a-input
                    v-model="formModel.dictType"
                    placeholder="请输入字典类型"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item field="status" label="状态">
                  <a-select
                    v-model="formModel.status"
                    placeholder="请选择状态"
                    allow-clear
                  >
                    <a-option value="0"> 正常</a-option>
                    <a-option value="1"> 停用</a-option>
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
              新建字典
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

            <a-popconfirm
              :content="'是否清空缓存?'"
              type="warning"
              @ok="clearDistCache"
            >
              <a-button type="primary" status="danger">
                <template #icon>
                  <icon-delete />
                </template>
                清空缓存
              </a-button>
            </a-popconfirm>
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
            <a-button @click="() => editDict(record)"> 编辑</a-button>
            <a-button @click="() => manageDict(record)"> 数据管理</a-button>
            <a-popconfirm
              :content="'是否确认删除' + record.dictName + '字典?'"
              type="warning"
              @ok="() => doDeleteDict(record.dictId)"
            >
              <a-button>
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>
    <!--添加和编辑的弹窗-->
    <a-modal
      v-model:visible="visible"
      :title="isEdit ? '编辑字典' : '添加字典'"
      @handle-cancel="handleCancel"
      @before-ok="handleBeforeOk"
    >
      <a-form ref="formRef" :model="modalFormModel">
        <a-form-item
          field="dictName"
          :label="'字典名称'"
          :rules="[{ required: true, message: 'required' }]"
        >
          <a-input v-model="modalFormModel.dictName" placeholder="字典名称" />
        </a-form-item>

        <a-form-item
          field="dictType"
          :label="'字典类型'"
          :rules="[{ required: true, message: 'required' }]"
        >
          <a-input v-model="modalFormModel.dictType" placeholder="字典类型" />
        </a-form-item>

        <a-form-item
          field="status"
          :label="'字典状态'"
          :rules="[{ required: true, message: 'required' }]"
        >
          <a-radio-group v-model="modalFormModel.status">
            <a-radio value="0">启用</a-radio>
            <a-radio value="1">禁用</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item field="remark" :label="'备注'">
          <a-textarea
            v-model="modalFormModel.remark"
            allow-clear
            placeholder="请输入内容"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <!--侧边抽屉-->
    <a-drawer
      v-model:visible="drawerVisible"
      :width="'80%'"
      :footer="false"
      unmount-on-close
    >
      <template #title> 【{{ drawerData.dictName }}】 - 数据管理 </template>
      <a-card class="general-card" title="字典数据管理">
        <a-row style="margin-bottom: 16px">
          <a-col :span="12">
            <a-space>
              <a-button type="primary" @click="drawerCreate">
                <template #icon>
                  <icon-plus />
                </template>
                新建字典数据
              </a-button>
            </a-space>
          </a-col>
        </a-row>

        <a-table :columns="drawerTableColumns" :data="drawerTableData">
          <template #statusSlot="{ record }">
            <a-tag v-if="record.status == 0" color="#00b42a"> 启用</a-tag>
            <a-tag v-else color="#86909c"> 禁用</a-tag>
          </template>

          <template #actionSlot="{ record }">
            <a-space>
              <a-button @click="() => drawerEdit(record)"> 编辑 </a-button>

              <a-popconfirm
                :content="'是否确认删除 【' + record.dictLabel + '】 字典数据?'"
                type="warning"
                @ok="() => doDeleteDictData(record.dictCode)"
              >
                <a-button>
                  <template #icon>
                    <icon-delete />
                  </template>
                  <template #default>删除</template>
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </a-table>
      </a-card>
    </a-drawer>
    <!--    抽屉的弹出层-->
    <a-modal
      v-model:visible="drawerModalVisible"
      :title="isDrawerEdit ? '编辑字典数据' : '添加字典数据'"
      @handle-cancel="handleDrawerCancel"
      @before-ok="handleDrawerBeforeOk"
    >
      <a-form ref="drawerModalFormRef" :model="drawerModalData">
        <a-form-item
          field="dictType"
          :label="'字典类型'"
          :rules="[{ required: true, message: 'required' }]"
        >
          <a-input
            v-model="drawerModalData.dictType"
            placeholder="字典类型"
            :disabled="true"
          />
        </a-form-item>

        <a-form-item
          field="dictLabel"
          :label="'数据标签'"
          :rules="[{ required: true, message: 'required' }]"
        >
          <a-input v-model="drawerModalData.dictLabel" placeholder="字典标签" />
        </a-form-item>

        <a-form-item
          field="dictValue"
          :label="'数据键值'"
          :rules="[{ required: true, message: 'required' }]"
        >
          <a-input v-model="drawerModalData.dictValue" placeholder="数据键值" />
        </a-form-item>
        <a-form-item
          field="dictSort"
          :label="'显示排序'"
          :rules="[{ required: true, message: 'required' }]"
        >
          <a-input-number
            v-model="drawerModalData.dictSort"
            placeholder="显示排序"
          />
        </a-form-item>
        <a-form-item
          field="status"
          :label="'字典状态'"
          :rules="[{ required: true, message: 'required' }]"
        >
          <a-radio-group v-model="drawerModalData.status">
            <a-radio value="0">启用</a-radio>
            <a-radio value="1">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item field="remark" :label="'备注'">
          <a-textarea
            v-model="drawerModalData.remark"
            allow-clear
            placeholder="请输入内容"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { dictParams, SysDict, SysDictData } from '@/types/SysDict';
  import {
    addDict,
    addDictData,
    clearCache,
    deleteDict,
    deleteDictData,
    getDictList,
    pageQueryDict,
    putDict,
    putDictData,
  } from '@/api/system/dist';
  import { Message, TableRowSelection } from '@arco-design/web-vue';

  const formModel = ref({
    dictName: '',
    dictType: '',
    status: '',
  } as dictParams);

  // 弹窗内表单数据
  const modalFormModel = ref({
    dictName: '',
    dictType: '',
    status: '0',
    remark: '',
  } as SysDict);

  const visible = ref(false);
  const isEdit = ref(false);

  // 抽屉是否可见
  const drawerVisible = ref(false);
  // 抽屉的弹出层是编辑还是添加
  const isDrawerEdit = ref(false);
  // 抽屉的弹出层是否可见
  const drawerModalVisible = ref(false);
  // 抽屉的弹出层当前展示数据
  const drawerModalData = ref({
    dictCode: 0,
    dictType: '',
    dictLabel: '',
    dictValue: '',
    dictSort: 0,
    status: '0',
    remark: '',
  } as SysDictData);
  // 抽屉当前展示数据
  const drawerData = ref({
    dictName: '',
    dictType: '',
    status: '0',
    remark: '',
  } as SysDict);

  // 字典标签 字典键值 字典排序 状态 备注 创建时间 操作
  const drawerTableColumns = [
    {
      title: '字典标签',
      dataIndex: 'dictLabel',
    },
    {
      title: '字典键值',
      dataIndex: 'dictValue',
    },
    {
      title: '字典排序',
      dataIndex: 'dictSort',
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'statusSlot',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      slotName: 'actionSlot',
    },
  ];
  const drawerTableData = ref([] as SysDictData[]);
  const drawerPagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 弹出层表单取消
  const handleCancel = () => {
    visible.value = false;
  };

  const rowSelection = ref({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

  const formRef = ref();
  const drawerModalFormRef = ref();
  const selectedKeys = ref([] as string[]);
  const columns = [
    {
      title: '字典名称',
      dataIndex: 'dictName',
    },
    {
      title: '字典类型',
      dataIndex: 'dictType',
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'statusSlot',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      slotName: 'actionSlot',
    },
  ];

  const listData = ref([] as SysDict[]);

  const batchDelete = () => {
    doDeleteDict(selectedKeys.value);
    // 清空选中
    selectedKeys.value = [];
  };

  const create = () => {
    isEdit.value = false;
    visible.value = true;
    // 表单初始化
    modalFormModel.value = {
      dictName: '',
      dictType: '',
      status: '0',
      remark: '',
    } as SysDict;
  };

  const editDict = (record: SysDict) => {
    isEdit.value = true;
    visible.value = true;
    modalFormModel.value = { ...record };
  };

  const drawerEdit = (record: SysDictData) => {
    isDrawerEdit.value = true;
    drawerModalData.value = { ...record };
    drawerModalVisible.value = true;
  };

  const handleDrawerCancel = () => {
    drawerVisible.value = false;
  };

  const handleDrawerBeforeOk = async () => {
    const validate = await drawerModalFormRef.value.validate();
    if (validate) return false;
    const { msg } = isDrawerEdit.value
      ? await putDictData(drawerModalData.value)
      : await addDictData(drawerModalData.value);
    Message.success(msg);
    await manageDict(drawerData.value);
    return true;
  };

  const handleBeforeOk = async () => {
    const validate = await formRef.value.validate();
    if (validate) return false;
    const { msg } = isEdit.value
      ? await putDict(modalFormModel.value)
      : await addDict(modalFormModel.value);
    Message.success(msg);
    await fetchData();
    return true;
  };

  const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const search = () => {
    pagination.value.current = 1;
    fetchData();
  };

  const reset = () => {
    formModel.value = {
      dictName: '',
      dictType: '',
      status: '',
    } as dictParams;
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

  // 清空缓存
  const clearDistCache = async () => {
    const { msg } = await clearCache();
    Message.success(msg);
  };

  // 删除& 批量删除 字典数据
  const doDeleteDictData = async (id: string) => {
    const { msg } = await deleteDictData(id);
    Message.success(msg);
    await manageDict(drawerData.value);
  };

  // 删除 & 批量删除 字典
  const doDeleteDict = async (id: string | string[]) => {
    const { msg } = await deleteDict(id);
    Message.success(msg);
    fetchData();
  };

  // 字典数据管理
  const manageDict = async (record: SysDict) => {
    drawerData.value = { ...record };
    // 获取数据
    const data = await pageQueryDict({
      dictType: record.dictType,
      current: drawerPagination.value.current,
      pageSize: drawerPagination.value.pageSize,
    });
    drawerTableData.value = data.data.records;
    drawerPagination.value.total = data.data.total;
    drawerVisible.value = true;
  };

  // 添加字典数据
  const drawerCreate = () => {
    drawerModalData.value.dictType = drawerData.value.dictType;
    drawerModalVisible.value = true;
  };

  // 获取数据
  const fetchData = async () => {
    const { data } = await getDictList({
      ...formModel.value,
      current: pagination.value.current,
      pageSize: pagination.value.pageSize,
    });
    listData.value = data.records;
    pagination.value.total = data.total;
  };
  fetchData();
</script>

<script lang="ts">
  export default {
    name: 'Dictionaries',
  };
</script>

<style scoped>
  .container {
    padding: 0 20px 20px;
  }
</style>
