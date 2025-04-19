<script>
import { defineAsyncComponent } from "vue";
const ApexChart = defineAsyncComponent(() => import("vue3-apexcharts"));
</script>
<template>
    <ApexChart
      width="100%"
      height="500"
      type="line"
      :options="options"
      :series="series"
    />
  </client-only>
</template>
