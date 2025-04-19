<script setup>
import { ref } from "vue";

const devices = ref(null);
const error = ref(null)

fetch("http://localhost:3000/api/device")
  .then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then((json) => {
    devices.value = json.data; // Ensure `json.data` exists
  })
  .catch((err) => {
    error.value = err.message; // Capture the error message
    console.error("Fetch error:", err);
  });

console.log(devices.value);
</script>
<template>
  <div v-if="!devices">
    <p class="text-center font-semibold text-xl">load data, please wait...</p>
  </div>
  <div v-if="error">
    <p class="text-center font-semibold text-xl">Please try again</p>
  </div>
  <div class="card" v-for="device in devices">
    <h1 class="text-xl font-regular text-white">{{ device.name }}</h1>
    <p class="text-md mt-2.5 text-gray-400 font-light">detail information:</p>
    <div>
      <p class="text-sm font-light text-gray-400">
        CO<sup>2</sup> : {{ device.data.co2 }}
      </p>
      <p class="text-sm font-light text-gray-400">CO : {{ device.data.co2 }}</p>
      <p class="text-sm font-light text-gray-400">NO : {{ device.data.co2 }}</p>
    </div>
  </div>
</template>
