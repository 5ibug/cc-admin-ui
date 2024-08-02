<script setup lang="ts">
  import { ref } from 'vue';
  import { PostPSearchParams, PostPageListItem, PostForm } from '@/types/Human';
  import { Message, TableRowSelection } from '@arco-design/web-vue';
  import { pageQuery, add, remove, edit } from '@/api/human/post';
  import type { disabledStatus } from '@/types/global';

  const listData = ref([] as PostPageListItem[]);
  const selectedKeys = ref([]);
  const formModel = ref({} as PostPSearchParams);
  const isEdit = ref(false);
  const visible = ref(false);
  const modalFormRef = ref();
  const modalData = ref({
    postCode: '',
    postId: 0,
    postName: '',
    postSort: 0,
    remark: '',
    status: '0',
  } as PostForm);

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
      title: '岗位编码',
      dataIndex: 'postCode',
    },
    {
      title: '岗位名称',
      dataIndex: 'postName',
    },
    {
      title: '岗位排序',
      dataIndex: 'postSort',
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
    listData.value = data?.records || [];
    pagination.value.total = data?.total || 0;
  };

  const search = () => {
    pagination.value.current = 1;
    fetchData();
  };

  const reset = () => {
    formModel.value = {
      postCode: null,
      postName: null,
      status: '',
    } as PostPSearchParams;
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
  const addPost = async (record: PostForm) => {
    const { msg } = await add(record);
    Message.success(msg);
  };
  const editPost = async (record: PostForm) => {
    const { msg } = await edit(record);
    Message.success(msg);
  };
  const deletePost = async (ids: number[]) => {
    console.log('deletePost', ids);
    const { msg } = await remove(ids);
    Message.success(msg);
    fetchData();
  };
  const openModal = async (record: PostPageListItem) => {
    modalData.value = {
      postCode: record.postCode,
      postId: record.postId,
      postName: record.postName,
      postSort: record.postSort,
      remark: record.remark,
      status: record.status,
    };
    isEdit.value = true;
    visible.value = true;
  };
  const batchDelete = () => {
    deletePost(selectedKeys.value);
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
      await editPost(modalData.value);
    } else {
      await addPost(modalData.value);
    }
    // 刷新数据
    await fetchData();
    return true;
  };
  const exportData = () => {};
  const create = () => {
    modalData.value = {
      postCode: '',
      postId: 0,
      postName: '',
      postSort: 0,
      remark: '',
      status: '0',
    };
    isEdit.value = false;
    visible.value = true;
  };
  fetchData();
</script>

<template>
  <div class="container">
    <Breadcrumb :items="['human.manage', 'human.post.list']" />
    <a-card class="general-card" title="岗位管理">
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
                <a-form-item field="postCode" label="岗位编码">
                  <a-input
                    v-model="formModel.postCode"
                    placeholder="请输入岗位编码"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="postName" label="岗位名称">
                  <a-input
                    v-model="formModel.postName"
                    placeholder="请输入岗位名称"
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
                    <a-radio value="0"> 正常 </a-radio>
                    <a-radio value="1"> 停用 </a-radio>
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
        row-key="postId"
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
            <a-button @click="() => openModal(record)"> 修改</a-button>
            <a-button @click="() => deletePost([record.postId])">
              删除</a-button
            >
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
          field="postName"
          label="岗位名称"
          :rules="[{ required: true, message: '请输入岗位名称' }]"
        >
          <a-input v-model="modalData.postName" placeholder="请输入岗位名称" />
        </a-form-item>
        <a-form-item
          field="postCode"
          label="岗位编码"
          :rules="[{ required: true, message: '请输入岗位编码' }]"
        >
          <a-input v-model="modalData.postCode" placeholder="请输入岗位编码" />
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
          field="postSort"
          label="岗位顺序"
          :rules="[{ required: true, message: '请输入岗位顺序' }]"
        >
          <a-input-number v-model="modalData.postSort" :min="0" />
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
