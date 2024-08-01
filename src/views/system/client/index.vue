<script setup lang="ts">
  import proTable from '@/components/ProTable/index.vue';
  import useProTable from '@/components/ProTable/hooks/useProTable';
  import { pageQuery } from '@/api/system/client';

  // 添加参数是表单数据
  const add = (record: any) => {
    console.log(record);
    return new Promise((resolve) => {});
  };

  // 编辑方法
  const edit = (record: any) => {
    console.log(record);
    return new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
  };

  // 删除方法
  const remove = (record: any) => {
    console.log(record);
    return new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
  };

  const [register] = useProTable({
    searchParam: [
      {
        name: '编号',
        field: 'clientId',
      },
    ],
    api: pageQuery,
    edit,
    add,
    remove,
    columns: [
      {
        title: '编号',
        dataIndex: 'clientId',
      },
      {
        title: '授权密钥',
        dataIndex: 'clientSecret',
        hidden: true,
      },
      {
        title: '授权范围',
        dataIndex: 'scope',
      },
      {
        title: '授权类型',
        dataIndex: 'authorizedGrantTypes',
        type: 'dict',
        dictType: 'sys_oauth_client_details',
      },
      {
        title: '令牌有效期',
        dataIndex: 'accessTokenValidity',
      },
      {
        title: '刷新令牌有效期',
        dataIndex: 'refreshTokenValidity',
      },
      {
        title: '操作',
        slotName: 'action',
      },
    ],
  });
</script>

<template>
  <div class="container">
    <Breadcrumb :items="['system.manage', 'system.menu.oauth2']" />
    <proTable @register="register as any" />
  </div>
</template>

<style scoped lang="less">
  .container {
    width: 100%;
    background-color: var(--color-fill-2);
    padding: 16px 20px 0;
  }
</style>
