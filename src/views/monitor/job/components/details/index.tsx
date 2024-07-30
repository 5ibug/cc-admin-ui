import { JobListData } from '@/types/JobCornType';
import { ref } from 'vue';

export default function details(data: JobListData) {
  return {
    setup() {
      const misfirePolicy = ref('');
      switch (data.misfirePolicy) {
        case '0':
          misfirePolicy.value = '默认策略';
          break;
        case '1':
          misfirePolicy.value = '立即执行';
          break;
        case '2':
          misfirePolicy.value = '执行一次';
          break;
        case '3':
          misfirePolicy.value = '放弃执行';
          break;
        default:
          misfirePolicy.value = '默认策略';
          break;
      }
      // 处理数据
      const d = ref([
        {
          label: '任务分组',
          value: data.jobGroup,
        },
        {
          label: '任务名称',
          value: data.jobName,
        },
        {
          label: '创建时间',
          value: data.createTime,
        },
        {
          label: 'cron表达式',
          value: data.cronExpression,
        },
        {
          label: '下次执行时间',
          value: data.nextValidTime,
        },
        {
          label: '任务状态',
          value: data.status === '0' ? '正常' : '暂停',
        },
        {
          label: '是否并发',
          value: data.concurrent === '0' ? '允许' : '禁止',
        },
        {
          label: '执行策略',
          value: misfirePolicy,
        },
        {
          label: '调用目标方法',
          value: data.invokeTarget,
        },
      ] as Array<{ label: string; value: string }>);
      return () => <a-descriptions data={d.value} align={'left'} column={2} />;
    },
  };
}
