<template>
  <div class="container">
    <Breadcrumb :items="['system.manage', 'menu.manage']" />

    <a-card class="general-card" :title="$t('menu.manage')">
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
                <a-form-item field="menuName" label="菜单名称">
                  <a-input
                    v-model="formModel.menuName"
                    placeholder="请输入菜单名称"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item field="status" label="菜单状态">
                  <a-select
                    v-model="formModel.status"
                    placeholder="请选择状态"
                    allow-clear
                  >
                    <a-option value="0"> 是 </a-option>
                    <a-option value="1"> 否 </a-option>
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
            <!--              v-permission="'system:menu:insert'"-->

            <a-button type="primary" @click="create">
              <template #icon>
                <icon-plus />
              </template>
              创建
            </a-button>
          </a-space>
        </a-col>
      </a-row>

      <a-table
        :columns="columns"
        :data="tableData.data"
        row-key="menuName"
        :loading="loading"
      >
        <template #menuName="{ record }">
          {{ record.menuName }}
        </template>

        <template #action="{ record }">
          <a-space>
            <a-button @click="() => createBy(record)"> 新增 </a-button>
            <a-button @click="() => editBy(record)"> 编辑 </a-button>
            <a-popconfirm
              content="是否删除"
              type="warning"
              @ok="() => deleteBy(record)"
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

        <template #statusSlot="{ record }">
          <a-tag v-if="record.status == 0" color="#00b42a"> 是 </a-tag>
          <a-tag v-else color="#86909c"> 否 </a-tag>
        </template>

        <template #visible="{ record }">
          <a-tag v-if="record.visible == 0" color="#00b42a"> 是 </a-tag>
          <a-tag v-else color="#86909c"> 否 </a-tag>
        </template>

        <!-- 原始i18n-->
        <template #i18n="{ record }">
          {{ record.menuName }}
        </template>

        <template #icon="{ record }">
          <icon :icon="record.icon" />
        </template>

        <template #perms="{ record }">
          {{ record.perms || '-' }}
        </template>
      </a-table>
    </a-card>

    <!--弹出层表单, 添加or编辑-->
    <a-modal
      v-model:visible="visible"
      :title="`${isEdit ? '编辑' : '新增'}`"
      width="768px"
      @cancel="handleCancel"
      @before-ok="handleBeforeOk"
    >
      <a-form ref="modalFormRef" :model="modalData">
        <!--    tree选择器选上级菜单-->
        <a-form-item
          field="parentId"
          label="上级菜单"
          :rules="[{ required: true, message: 'required' }]"
        >
          <a-tree-select
            v-model="modalData.parentId"
            :data="treeSelectData"
            placeholder="请选择上级菜单"
          >
          </a-tree-select>
        </a-form-item>
        <!--    菜单类型 （M目录 C菜单 F按钮）-->
        <a-form-item
          field="menuType"
          label="菜单类型"
          :rules="[{ required: true, message: 'required' }]"
        >
          <a-radio-group v-model="modalData.menuType">
            <a-radio value="M"> 目录 </a-radio>
            <a-radio value="C"> 菜单 </a-radio>
            <a-radio value="F"> 按钮 </a-radio>
          </a-radio-group>
        </a-form-item>
        <!--    菜单图标 (图标选择器组件 自定义)-->
        <a-form-item field="icon" label="图标">
          <a-trigger
            trigger="focus"
            :click-to-close="false"
            :blur-to-close="false"
          >
            <a-input v-model="modalData.icon" />
            <template #content>
              <a-card :style="{ width: '360px' }" title="图标选择">
                <select-icon v-model="modalData.icon" />
              </a-card>
            </template>
          </a-trigger>
        </a-form-item>
        <!--菜单名称i18n的  显示排序    是否外链 路由地址 显示状态 菜单状态-->
        <a-form-item
          field="menuName"
          label="菜单名称"
          :rules="[{ required: true, message: 'required' }]"
        >
          <a-input v-model="modalData.menuName" placeholder="请输入菜单名称" />
        </a-form-item>

        <a-form-item
          field="orderNum"
          label="排序"
          :rules="[{ required: true, message: 'required' }]"
        >
          <a-input-number
            v-model="modalData.orderNum"
            model-event="input"
            hide-button
          />
        </a-form-item>

        <a-form-item
          field="isFrame"
          label="是否外链"
          :rules="[{ required: true, message: 'required' }]"
        >
          <a-radio-group v-model="modalData.isFrame">
            <a-radio value="0"> 是 </a-radio>
            <a-radio value="1"> 否 </a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item field="perms" label="权限标识">
          <a-input v-model="modalData.perms" placeholder="请输入权限标识" />
        </a-form-item>

        <a-form-item field="path" label="路由地址">
          <a-input v-model="modalData.path" placeholder="请输入路由地址" />
        </a-form-item>

        <a-form-item
          field="status"
          label="菜单状态"
          :rules="[{ required: true, message: 'required' }]"
        >
          <a-radio-group v-model="modalData.status">
            <a-radio value="0"> 是 </a-radio>
            <a-radio value="1"> 否 </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          field="visible"
          label="是否在nav展示"
          :rules="[{ required: true, message: 'required' }]"
        >
          <a-radio-group v-model="modalData.visible">
            <a-radio value="0"> 显示 </a-radio>
            <a-radio value="1"> 隐藏 </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import useLoading from '@/hooks/loading';
  import {
    addMenu,
    deleteMenu,
    editMenu,
    getMenuList,
    getMenuTreeList,
  } from '@/api/system/menu';
  import { reactive, ref } from 'vue';
  import { SysMenu, SysMenuForm, SysTreeMenu } from '@/types/SysMenu';
  import icon from '@/components/icon/index.vue';
  import { useI18n } from 'vue-i18n';
  import selectIcon from '@/components/select-icon/index.vue';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading();
  const modalFormRef = ref();
  // 记录新增or编辑
  const isEdit = ref(false);
  // 拟态窗数据
  const modalData = ref({
    menuId: 0,
    icon: '',
    parentId: 0,
    menuType: 'M',
    menuName: '',
    orderNum: 0,
    isFrame: '1',
    perms: '',
    path: '',
    status: '1',
    visible: '0',
  } as SysMenuForm);

  const treeSelectData = ref([] as SysTreeMenu[]);
  // 点击创建按钮
  const create = async () => {
    // init
    modalData.value = {
      menuId: 0,
      icon: '',
      parentId: 0,
      menuType: 'M',
      menuName: '',
      orderNum: 0,
      isFrame: '1',
      perms: '',
      path: '',
      status: '0',
      visible: '0',
    };

    isEdit.value = false;
    visible.value = true;
    // 获取动态下拉上级菜单
    const { data } = await getMenuTreeList();
    // 最外层加个主菜单
    treeSelectData.value.push({ key: 0, title: '主目录', children: [] });
    // 递归添加子菜单, 但是要把title加个t处理i18n
    const addTitle = (list: SysTreeMenu[]) => {
      list.forEach((item) => {
        item.title = t(item.title);
        if (item.children) {
          addTitle(item.children);
        }
      });
    };
    addTitle(data);
    treeSelectData.value[0].children = data;
  };

  const createBy = (record: SysMenu) => {
    // 设置上级菜单
    create();
    modalData.value.parentId = record.menuId;
  };

  const editBy = (record: SysMenu) => {
    create();
    isEdit.value = true;
    visible.value = true;
    modalData.value = { ...record };
  };

  const deleteBy = async (record: SysMenu) => {
    await deleteMenu(record.menuId);
    await fetchData();
  };

  const formModel = ref({
    menuName: '',
    status: null,
  });

  // 弹出层表单是否展示
  const visible = ref(false);

  // 弹出层表单取消
  const handleCancel = () => {
    visible.value = false;
  };

  // 弹出层表单确定前处理
  const handleBeforeOk = async () => {
    // 表单校验
    const validate = await modalFormRef.value.validate();
    if (validate) return false;
    // 提交数据
    if (isEdit.value) {
      await editMenu(modalData.value);
    } else {
      await addMenu(modalData.value);
    }
    // 刷新数据
    await fetchData();
    return true;
  };

  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      slotName: 'menuName',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      slotName: 'icon',
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
    },
    {
      title: '权限标识',
      dataIndex: 'perms',
      slotName: 'perms',
    },
    {
      title: '路径',
      dataIndex: 'path',
    },
    {
      title: '是否在nav展示',
      dataIndex: 'visible',
      slotName: 'visible',
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'statusSlot',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      slotName: 'action',
    },
  ];

  const tableData = reactive({
    data: [] as SysMenu[],
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const { data } = await getMenuList({ ...formModel.value });
      const list2tree = (list: SysMenu[]) => {
        const map = new Map<number, SysMenu>();
        list.forEach((item) => {
          map.set(item.menuId, item);
        });
        const result: SysMenu[] = [];
        list.forEach((item) => {
          const parent = map.get(item.parentId);
          if (parent) {
            if (!parent.children) {
              parent.children = [];
            }
            parent.children.push(item);
          } else {
            result.push(item);
          }
        });
        return result;
      };

      tableData.data = list2tree(data);
      // list转为tree格式
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    fetchData();
  };

  const reset = () => {
    formModel.value = {
      menuName: '',
      status: null,
    };
    fetchData();
  };

  fetchData();
</script>

<script lang="ts">
  export default {
    name: 'SystemMenu',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px;
  }
</style>
