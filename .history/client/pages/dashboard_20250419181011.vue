<script>
import Header from "../components/Header/index.vue"
import Devices from "../components/devices/index.vue"
export const clientOnly = true
</script>

<template>
  <div class="w-full h-screen bg-[#06202B]">
    <Header />
    <Devices />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
