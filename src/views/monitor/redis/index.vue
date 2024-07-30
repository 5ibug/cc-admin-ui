<template>
  <div class="container">
    <Breadcrumb :items="['system.monitor', 'monitor.redis.query']" />
    <a-row :gutter="24">
      <a-col :span="16">
        <a-card title="基本信息">
          <a-descriptions :data="basicInfo" title="" bordered size="large" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="命令统计">
          <CommandChart :value="redisInfo.commandStats" />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue';
  import getRedisInfo from '@/api/system/redis';
  import type { RedisData } from '@/types/RedisInfoType';
  import CommandChart from '@/views/monitor/redis/compoents/command-chart.vue';
  import useLoading from '@/hooks/loading';

  const { setLoading } = useLoading(true);

  // 基本信息
  const basicInfo = ref([] as Array<{ label: string; value: string }>);
  const redisInfo = ref({} as RedisData);
  const timer = ref<number>(0);
  const init = () => {
    setLoading(true);
    getRedisInfo()
      .then((res) => {
        redisInfo.value = res.data;
        basicInfo.value = [
          { label: 'Redis版本', value: redisInfo.value.info.redis_version },
          { label: '运行模式', value: redisInfo.value.info.redis_mode },
          { label: '端口', value: redisInfo.value.info.tcp_port },
          { label: '客户端数', value: redisInfo.value.info.connected_clients },
          { label: '运行时间(天)', value: redisInfo.value.info.uptime_in_days },
          { label: '内存占用', value: redisInfo.value.info.used_memory_human },
          {
            label: '内存占用峰值',
            value: redisInfo.value.info.used_memory_peak_human,
          },
          {
            label: '内存碎片率',
            value: redisInfo.value.info.mem_fragmentation_ratio,
          },
          {
            label: 'cpu占用',
            value: redisInfo.value.info.used_cpu_user_children,
          },
          { label: '内存配置', value: redisInfo.value.info.maxmemory_human },
          {
            label: 'AOF是否开启',
            value: redisInfo.value.info.aof_enabled ? '是' : '否',
          },
          {
            label: 'RDB是否开启',
            value: redisInfo.value.info.rdb_bgsave_in_progress ? '是' : '否',
          },
          {
            label: 'RDB最后一次保存时间',
            value: redisInfo.value.info.rdb_last_bgsave_status,
          },
          {
            label: '网络入口/出口',
            value: `${redisInfo.value.info.instantaneous_input_kbps}kps/${redisInfo.value.info.instantaneous_output_kbps}kps`,
          },
        ];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 每2秒刷新一次
  onMounted(() => {
    init();
    timer.value = window.setInterval(init, 1000 * 2);
  });
  // 取消定时器
  onBeforeUnmount(() => {
    window.clearInterval(timer.value);
  });
</script>

<script lang="ts">
  export default {
    name: 'Redis',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px;
  }
</style>
