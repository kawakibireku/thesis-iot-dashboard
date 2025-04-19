<script setup>
import Header from "../components/Header/index.vue"
import Devices from "../components/devices/index.vue"
</script>

<template>
  <div class="w-full __background-dashboard">
    <Header />
    <Devices />
  </div>
</template>

<script>
export const clientOnly = true
</script>

<style scoped>
.__background-dashboard {
  background-color: var(--bg-secondary);
}
</style>
