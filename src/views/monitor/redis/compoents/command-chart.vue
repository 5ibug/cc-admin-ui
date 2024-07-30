<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{
        padding: '20px',
      }"
    >
      <Chart height="310px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import useLoading from '@/hooks/loading';
  import useChartOption from '@/hooks/chart-option';
  import { defineProps } from 'vue/dist/vue';

  const { loading } = useLoading();

  const props = defineProps({
    value: {
      type: Array<{ name: string; value: string }>,
      default: () => [],
    },
  });

  const { chartOption } = useChartOption((isDark) => {
    // echarts support https://echarts.apache.org/zh/theme-builder.html
    // It's not used here
    return {
      legend: {
        left: 'center',
        // props.value的全部name
        data: props.value.map((item: any) => item.name),
        bottom: 0,
        icon: 'circle',
        itemWidth: 8,
        textStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
        },
        itemStyle: {
          borderWidth: 0,
        },
      },
      tooltip: {
        show: true,
        trigger: 'item',
      },
      graphic: {
        elements: [
          // {
          //   type: 'text',
          //   left: 'center',
          //   top: '40%',
          //   style: {
          //     text: '内容量',
          //     textAlign: 'center',
          //     fill: isDark ? '#ffffffb3' : '#4E5969',
          //     fontSize: 14,
          //   },
          // },
          // {
          //   type: 'text',
          //   left: 'center',
          //   top: '50%',
          //   // style: {
          //   //   text: '928,531',
          //   //   textAlign: 'center',
          //   //   fill: isDark ? '#ffffffb3' : '#1D2129',
          //   //   fontSize: 16,
          //   //   fontWeight: 500,
          //   // },
          // },
        ],
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['50%', '40%'],
          label: {
            formatter: '{d}%',
            fontSize: 10,
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
          },
          itemStyle: {
            borderColor: isDark ? '#232324' : '#fff',
            borderWidth: 1,
          },
          data: [...props.value],
        },
      ],
    };
  });
</script>
