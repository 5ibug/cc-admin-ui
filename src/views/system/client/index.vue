<script setup lang="ts">
  import proTable from '@/components/ProTable/index.vue';
  import useProTable from '@/components/ProTable/hooks/useProTable';
  import { pageQuery } from '@/api/system/client';

  const [register] = useProTable({
    searchParam: [
      {
        name: '编号',
        field: 'clientId',
      },
    ],
    api: pageQuery,
    columns: [
      {
        title: '编号',
        dataIndex: 'clientId',
      },
      {
        title: '授权范围',
        dataIndex: 'scope',
      },
      {
        title: '授权类型',
        dataIndex: 'authorizedGrantTypes',
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

    <proTable @register="register as any">
      <template #action="{ record }"> {{ record.clientId }} 操作 </template>
    </proTable>
  </div>
</template>

<style scoped lang="less">
  .container {
    width: 100%;
    background-color: var(--color-fill-2);
    padding: 16px 20px 0;
  }
</style>
