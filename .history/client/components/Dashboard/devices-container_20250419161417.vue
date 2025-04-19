<script setup>
import { ref } from "vue";

const devices = ref(null);
const error = ref(null)


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
    <div class="card" v-for="device in devices" :key="device.id">
      <h1 class="text-xl font-regular text-white">{{ device.name }}</h1>
      <p class="text-md mt-2.5 text-gray-400 font-light">Detail information:</p>
      <div>
        <p class="text-sm font-light text-gray-400">
          CO<sup>2</sup>: {{ device.data.co2 }}
        </p>
        <p class="text-sm font-light text-gray-400">CO: {{ device.data.co }}</p>
        <p class="text-sm font-light text-gray-400">NO: {{ device.data.no }}</p>
      </div>
    </div>
  </template>
