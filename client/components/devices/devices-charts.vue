<script setup>
import { watch, defineAsyncComponent, onUnmounted, reactive } from "vue";
import ClientOnly from "../ClientOnly.vue";

// Import ApexCharts only on the client side
const ApexChart = defineAsyncComponent(() =>
  import("vue3-apexcharts").then((module) => module.default)
);

// Define props
const props = defineProps({
  deviceId: String,
  type: String,
  startDate: String,
  endDate: String,
  chartData: Object,
  isLoading: Boolean
});

// Reactive variables for chart data
const chartData = reactive({
  series: [],
  options: {
    chart: {
      type: "line",
      id: "apexchart-id", // Add an ID for the chart
    },
    fill: {
      colors: ["#6610f2"],
    },
    xaxis: {
      categories: [],
      labels: {
        style: {
          colors: [],
          fontSize: "10px",
        },
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: null,
        }
      }
    },
    title: {
      text: "Device Chart",
      align: "center",
      style: {
        color: '#cd23b2',
        fontSize: "16px",
      },
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

      // Ensure categories are treated as strings
      if (newChartData.chartData.options?.xaxis?.categories) {
        chartData.options.yaxis.labels.style.colors = newChartData.chartData.options.yaxis.labels.style.colors
        chartData.options.xaxis.labels.style.colors = newChartData.chartData.options.xaxis.labels.style.colors
        chartData.options.xaxis.categories =
          newChartData.chartData.options.xaxis.categories
      }

      // Update the title color dynamically if provided
      if (newChartData.chartData.options?.title?.text) {
        chartData.options.title.text = newChartData.chartData.options.title.text
      }
    }
  },
  { immediate: true }
);

// Clean up ApexCharts instance on unmount
onUnmounted(() => {
  const chart = ApexCharts.getChartByID("apexchart-id");
  if (chart) {
    chart.destroy();
  }
});
</script>

<template>
  <ClientOnly>
    <div
      class="text-[#cd23b2] text-center h-screen"
      v-if="isLoading"
    >
      loading. please wait...
    </div>
    <ApexChart
      v-else
      width="100%"
      height="500"
      type="line"
      :options="chartData.options"
      :series="chartData.series"
    />
  </ClientOnly>
</template>

<style scoped>
.apexcharts-yaxis-label {
  color: var(--bg-pink) !important;
}

.apexcharts-xaxis-label {
  color: var(--bg-pink) !important;
}
</style>
