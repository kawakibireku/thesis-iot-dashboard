<script setup>
import { ref, defineAsyncComponent } from 'vue';
import ClientOnly from '../ClientOnly.vue';

const ApexChart = defineAsyncComponent(() => import('vue3-apexcharts'));

defineProps({
  startDate,
  endDate,
})
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
  <ClientOnly>
    <ApexChart
      width="100%"
      height="500"
      type="line"
      :options="chartOptions"
      :series="series"
    />
  </ClientOnly>
</template>