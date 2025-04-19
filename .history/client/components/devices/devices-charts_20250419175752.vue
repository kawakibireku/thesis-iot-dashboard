<script>
import { defineAsyncComponent } from "vue";

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
