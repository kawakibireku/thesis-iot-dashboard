<script setup>
import { ref, defineAsyncComponent } from 'vue';
import ClientOnly from '../ClientOnly.vue';

const ApexChart = defineAsyncComponent(() => import('vue3-apexcharts'));

const props = defineProps({
  deviceId: String,
  type: String,
  startDate: String,
  endDate: String,
  chartData: Object,
});

const series = ref([
  {
    name: 'CO2 Levels',
    data: [10, 40, 35, 50, 49],
  },
]);

const chartOptions = ref({
  chart: {
    type: 'line',
  },
  fill: {
    colors: ['#6610f2'],
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  },
});

// Watch for changes in chartData from parent component
watch(
  () => props.chartData,
  (newChartData) => {
    if (newChartData) {
      series.value = newChartData.series;
      chartOptions.value = newChartData.options;
    }
  },
  { immediate: true }
);
</script>

<template>
  <ClientOnly>
    <ApexChart
      width="100%"
      height="500"
      type="line"
      :options="chartOptions.value"
      :series="series.value"
    />
  </ClientOnly>
</template>
