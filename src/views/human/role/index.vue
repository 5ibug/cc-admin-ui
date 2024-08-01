<script setup lang="ts">
  import { ref } from 'vue';
  import proTable from '@/components/ProTable/index.vue';
  import useProTable from '@/components/ProTable/hooks/useProTable';
  import {
    RoleSearchParams,
    RolePageListItem,
    RoleForm,
    roleScope,
  } from '@/types/Human';
  import { Message, TableRowSelection } from '@arco-design/web-vue';
  import { pageQuery, add, remove, edit } from '@/api/human/role';
  import { getSystemMenuTree, getRoleSystemMenuTreeKeys } from '@/utils/sys';
  import { SysTreeMenu } from '@/types/SysMenu';
  import { useI18n } from 'vue-i18n';
  import type { disabledStatus } from '@/types/global';

  const [register] = useProTable({
    searchParam: [
      {
        name: '角色名称',
        field: 'roleName',
      },
      {
        name: '权限字符',
        field: 'roleKey',
      },
      {
        name: '状态',
        field: 'status',
      },
    ],
    api: pageQuery,
    columns: [
      {
        title: '角色名称',
        dataIndex: 'roleName',
      },
      {
        title: '权限字符',
        dataIndex: 'roleKey',
      },
      {
        title: '显示顺序',
        dataIndex: 'roleSort',
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
        title: '创建时间',
        slotName: 'createTime',
      },
      {
        title: '操作',
        slotName: 'action',
      },
    ],
  });

  const { t } = useI18n();
  const treeSelectData = ref([] as SysTreeMenu[]);
  const listData = ref([] as RolePageListItem[]);
  const selectedKeys = ref([]);
  const defaultCheckKey = ref<number[]>([]);
  const formModel = ref({} as RoleSearchParams);
  const isEdit = ref(false);
  const visible = ref(false);
  const modalFormRef = ref();
  const dataScopeOptions = [
    {
      key: '1',
      value: '1',
      title: '全部数据权限',
    },
    {
      key: '2',
      value: '2',
      title: '自定数据权限',
    },
    {
      key: '3',
      value: '3',
      title: '本部门数据权限',
    },
    {
      key: '4',
      value: '4',
      title: '本部门及以下数据权限',
    },
    {
      key: '5',
      value: '5',
      title: '仅本人数据权限',
    },
  ];
  const modalData = ref({
    dataScope: '1',
    deptIds: [],
    menuIds: [],
    remark: '',
    roleId: 0,
    roleKey: '',
    roleName: '',
    roleSort: 0,
    status: '0',
  } as RoleForm);

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
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '权限字符',
      dataIndex: 'roleKey',
    },
    {
      title: '显示顺序',
      dataIndex: 'roleSort',
    },
    {
      title: '状态',
      slotName: 'statusSlot',
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

  // 获取数据
  const fetchData = async () => {
    const { data } = await pageQuery({
      ...formModel.value,
      current: pagination.value.current,
      pageSize: pagination.value.pageSize,
    });
    listData.value = data.records;
    pagination.value.total = data.total;
  };

  const search = () => {
    pagination.value.current = 1;
    fetchData();
  };

  const reset = () => {
    formModel.value = {
      roleName: '',
      roleKey: '',
      status: '',
    } as RoleSearchParams;
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
  // 弹出层表单取消
  const handleCancel = () => {
    visible.value = false;
  };
  const addRole = async (record: RoleForm) => {
    const { msg } = await add(record);
    Message.success(msg);
  };
  const editRole = async (record: RoleForm) => {
    const { msg } = await edit(record);
    Message.success(msg);
  };
  const deleteRole = async (ids: number[]) => {
    console.log('deleteRole', ids);
    const { msg } = await remove(ids);
    Message.success(msg);
    fetchData();
  };
  const openModal = async (record: RolePageListItem) => {
    const keys = await getRoleSystemMenuTreeKeys(record.roleId);
    treeSelectData.value = await getSystemMenuTree(t);
    modalData.value = {
      dataScope: record.dataScope,
      deptIds: [],
      menuIds: keys,
      remark: record.remark,
      roleId: record.roleId,
      roleKey: record.roleKey,
      roleName: record.roleName,
      roleSort: record.roleSort,
      status: record.status,
    };
    defaultCheckKey.value = keys;
    isEdit.value = true;
    visible.value = true;
  };
  const batchDelete = () => {
    deleteRole(selectedKeys.value);
    // 清空选中
    selectedKeys.value = [];
  };
  // 弹出层表单确定前处理
  const handleBeforeOk = async () => {
    // 表单校验
    const validate = await modalFormRef.value.validate();
    if (validate) return false;
    // 提交数据
    if (isEdit.value) {
      await editRole(modalData.value);
    } else {
      await addRole(modalData.value);
    }
    // 刷新数据
    await fetchData();
    return true;
  };

  const exportData = () => {};
  const create = async () => {
    modalData.value = {
      dataScope: '1',
      deptIds: [],
      menuIds: [],
      remark: '',
      roleId: 0,
      roleKey: '',
      roleName: '',
      roleSort: 0,
      status: '0',
    };
    treeSelectData.value = await getSystemMenuTree(t);
    console.log('treeSelectData', treeSelectData.value);
    defaultCheckKey.value = [];
    isEdit.value = false;
    visible.value = true;
  };
  const onMenuCheck = (e: any) => {
    console.log('选择数', e, modalData.value.menuIds);
  };
  fetchData();
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
                <a-form-item field="dictName" label="角色名称">
                  <a-input
                    v-model="formModel.roleName"
                    placeholder="请输入用户账号"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="dictType" label="权限字符">
                  <a-input
                    v-model="formModel.roleKey"
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
          </a-space>
        </a-col>
      </a-row>

      <a-table
        v-model:selectedKeys="selectedKeys"
        :columns="columns"
        :data="listData"
        :row-selection="rowSelection"
        row-key="roleId"
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
            <a-button @click="() => openModal(record)">
              <template #icon>
                <icon-edit />
              </template>
              <template #default>编辑</template>
            </a-button>
            <a-button @click="() => deleteRole([record.roleId])">
              <template #icon>
                <icon-delete />
              </template>
              <template #default>删除</template>
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <!--弹出层表单, 添加or编辑-->
    <a-modal
      v-model:visible="visible"
      :title="`${isEdit ? '编辑' : '新增'}`"
      @cancel="handleCancel"
      @before-ok="handleBeforeOk"
    >
      <a-form ref="modalFormRef" :model="modalData">
        <a-form-item
          field="roleName"
          label="角色名称"
          :rules="[{ required: true, message: '请输入角色名称' }]"
        >
          <a-input v-model="modalData.roleName" placeholder="请输入角色名称" />
        </a-form-item>
        <a-form-item
          field="roleKey"
          label="权限字符"
          :rules="[{ required: true, message: '请输入角色权限的字符' }]"
        >
          <a-input v-model="modalData.roleKey" placeholder="请输入权限字符" />
        </a-form-item>
        <a-form-item field="dataScope" label="权限范围">
          <a-select v-model="modalData.dataScope" placeholder="权限范围">
            <a-option
              v-for="i in dataScopeOptions"
              :key="i.key"
              :value="i.key"
              :label="i.title"
            ></a-option>
          </a-select>
        </a-form-item>
        <a-form-item
          field="status"
          label="角色状态"
          :rules="[{ required: true }]"
        >
          <a-radio-group v-model="modalData.status">
            <a-radio value="0"> 正常 </a-radio>
            <a-radio value="1"> 停用 </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          field="roleSort"
          label="角色顺序"
          :rules="[{ required: true, message: '请输入角色顺序' }]"
        >
          <a-input-number v-model="modalData.roleSort" :min="0" />
        </a-form-item>
        <!--    tree选择器选上级菜单-->
        <a-form-item field="menuIds" label="菜单权限">
          <a-tree
            v-model:checked-keys="modalData.menuIds"
            v-model:default-checked-keys="defaultCheckKey"
            :expanded-keys="[0]"
            :checkable="true"
            :data="treeSelectData"
            @check="onMenuCheck"
          />
        </a-form-item>
        <a-form-item field="remark" label="备注">
          <a-textarea
            v-model="modalData.remark"
            placeholder="输入备注..."
            :auto-size="{
              minRows: 2,
              maxRows: 5,
            }"
            allow-clear
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px;
  }
</style>
