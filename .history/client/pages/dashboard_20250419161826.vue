<script setup lang="ts">
import Dashboard from "../components/Dashboard/index.vue"
import Header from "../components/header/index.vue"
</script>

<template>
  <div class="w-full bg-[#06202B]">
    <Header />
    <Suspense>
      
    </Suspense>
    <Dashboard />
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
