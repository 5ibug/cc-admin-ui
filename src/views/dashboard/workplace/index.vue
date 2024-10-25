<template>
  <div class="container">
    <a-grid :cols="24" :row-gap="16" :col-gap="16">
      <a-grid-item class="panel" :span="18">
        <div style="padding-left: 3rem; padding-top: 3rem">
          <p>欢迎使用CC Admin</p>
          <p>当前CC Admin版本 {{ workplaceData.version }}</p>
          <p>当前SpringBoot版本 {{ workplaceData.springVersion }}</p>
          <p>测试字典：<dict type="sys_user_sex">1</dict></p>
          <p>测试字典：<dict type="sys_user_sex" value="0" /></p>
        </div>
      </a-grid-item>
      <a-grid-item class="panel" :span="6">
        <a-list size="medium">
          <template #header> 微服务列表</template>
          <a-list-item
            v-for="(item, index) in workplaceData.service"
            :key="index"
            :style="item == 0 && 'color:red;'"
            :title="item == 0 ? '无在线服务' : '服务运行正常'"
          >
            {{ index }} - {{ item }}
          </a-list-item>
        </a-list>
      </a-grid-item>
    </a-grid>

    <a-grid :cols="24" :row-gap="16" :col-gap="16" style="margin-top: 10px">
      <a-grid-item class="panel" :span="24" style="padding: 20px">
        {{ text }}
      </a-grid-item>
    </a-grid>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { info, WorkplaceData } from '@/api/system/workplace';
  import { mutil } from '@/api/ai/test';
  import dict from '@/components/dict';

  const workplaceData = ref<WorkplaceData>({
    service: undefined,
    version: '',
    springVersion: '',
  });

  const text = ref<string>('');
  // 获取数据
  onMounted(async () => {
    workplaceData.value = (await info()).data;

    mutil({
      onMessage: (res) => {
        const data = JSON.parse(res.data);
        text.value = `${text.value}${data.result.output.content}`;
      },
      onError: () => {},
    });
  });
</script>

<script lang="ts">
  export default {
    name: 'Dashboard', // If you want the include property of keep-alive to take effect, you must name the component
  };
</script>

<style scoped lang="less">
  .container {
    width: 100%;
    background-color: var(--color-fill-2);
    padding: 16px 20px 0;
    //display: flex;
  }

  .panel {
    background-color: var(--color-bg-2);
    border-radius: 4px;
    overflow: auto;
  }
</style>
