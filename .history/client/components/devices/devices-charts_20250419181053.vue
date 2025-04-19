<script setup>
import { ref, defineAsyncComponent, onMounted } from 'vue';
import ClientOnly from '../client-only.vue';

const ApexChart = defineAsyncComponent(() => import('vue3-apexcharts'));

const series = ref([
  {
    name: "CO2 Levels",
    data: [10, 40, 35, 50, 49],
  },
]);

const chartOptions = ref({
  chart: {
    type: 'line',
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  },
});
</script>
<template>
      <ApexChart
      width="100%"
      height="500"
      type="line"
      :options="options"
      :series="series"
    />
</template>
