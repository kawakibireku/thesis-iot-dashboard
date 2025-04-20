<script setup>
import { watch, defineAsyncComponent, onUnmounted, reactive } from 'vue';
import ClientOnly from '../ClientOnly.vue';

const ApexChart = defineAsyncComponent(() => import('vue3-apexcharts'));

// Define props
const props = defineProps({
  deviceId: String,
  type: String,
  startDate: String,
  endDate: String,
  chartData: Object,
});

// Reactive variables for chart data
const chartData = reactive({
  series: [],
  options: {
    chart: {
      type: 'line',
    },
    fill: {
      colors: ['#6610f2'],
    },
    xaxis: {
      categories: [],
    },
  },
});

// Watch for changes in chartData and update the chart
watch(
  () => props.chartData,
  (newChartData) => {
    if (newChartData && newChartData.chartData) {
      console.log("Updating series: ", newChartData.chartData.series);
      console.log("Updating chartOptions: ", newChartData.chartData.options);

      // Update the reactive object's properties
      chartData.series = newChartData.chartData.series || [];
      Object.assign(chartData.options, newChartData.chartData.options || {});
    }
  },
  { immediate: true }
);

// Clean up ApexCharts instance on unmount
onUnmounted(() => {
  const chart = ApexCharts.getChartByID('apexchart-id');
  if (chart) {
    chart.destroy();
  }
});
</script>

<template>
  <ClientOnly>
    <div class="text-white" v-if="!props.chartData || !props.chartData.chartData">
      loading...
    </div>
    <ApexChart
      width="100%"
      height="500"
      type="line"
      :options="chartData.options"
      :series="chartData.series"
    />
  </ClientOnly>
</template>