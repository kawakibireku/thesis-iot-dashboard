<script setup>
import { ref } from "vue";

const devices = ref(null);

fetch("http://localhost:3000/api/device")
  .then((res) => res.json())
  .then((json) => (devices.value = json.));

console.log(devices);
</script>
<template>
  <div v-if="!devices">
    <p class="text-center font-semibold text-xl">load data, please wait...</p>
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
