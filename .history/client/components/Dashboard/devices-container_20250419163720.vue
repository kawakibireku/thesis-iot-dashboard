<script setup>
import { ref, onMounted } from 'vue';

const devices = ref(null);
const error = ref(null);

async function fetchData() {
  try {
    const response = await fetch('http://localhost:3000/api/device');
    const json = await response.json();
    devices.value = json.data;
  } catch (err) {
    error.value = err.message; // You need `.value` for refs
  }
}

// Call fetchData when the component is mounted
onMounted(() => {
  fetchData();
});
</script>

<template>
  <div v-if="error">
    <p class="text-center font-semibold text-xl text-red-500">
      Error: {{ error }}
    </p>
  </div>
  <div v-else-if="!devices">
    <p class="text-center font-semibold text-xl">Loading data, please wait...</p>
  </div>
  <div v-else>
    <div class="card" v-for="device in devices" :key="device.id">
      <h1 class="text-xl font-regular text-white">{{ device.name }}</h1>
      <p class="text-md mt-2.5 text-gray-400 font-light">Detail information:</p>
      <div>
        <p class="text-sm font-light text-gray-400">
          CO<sup>2</sup>: {{ device.sensor }}
        </p>
        <p class="text-sm font-light text-gray-400">CO: {{ device.sensor }}</p>
        <p class="text-sm font-light text-gray-400">NO: {{ device.sensor }}</p>
      </div>
    </div>
  </div>
</template>

<style>
.card {
  padding: 10px;
  border-radius: 5px;
  background-color: #0a3243;
}

.active {
  background-color: green;
}
</style>