<script setup lang="ts">
  import { ref } from 'vue';
//   import { getDeviceById } from '../services/devices';
//   import type { Device } from '../types/device';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css'

  const date = ref();

  const devices = ref(null)
  const idActive = ref(1)

  fetch('http://localhost:3000/api/device').then((res) => res.json()).then(res => devices = res.data)

  function changeDevice(id) {
    if (id !== idActive.value) {
      idActive.value = id
    }
  }
</script>

<template>
  <VueDatePicker v-model="date"></VueDatePicker>
  <div class="container mx-auto py-5 grid grid-cols-3 gap-5">
    <!-- device information -->
     <div v-if="!devices">
        <p class="text-center font-semibold text-xl">load data, please wait...</p>
     </div>
    <div class="card" v-for="device in devices">
      <h1 class="text-xl font-regular text-white">{{device.name}}</h1>
      <p class="text-md mt-2.5 text-gray-400 font-light">detail information:</p>
      <div>
        <p class="text-sm font-light text-gray-400">CO<sup>2</sup> : {{ device.data.co2 }}</p>
        <p class="text-sm font-light text-gray-400">CO : {{ device.data.co2 }}</p>
        <p class="text-sm font-light text-gray-400">NO : {{ device.data.co2 }}</p>
      </div>
    </div>

    <!-- device charts -->
    <div class="card col-span-3">
      <!-- header charts -->
      <div class="flex justify-between mb-10">
        <!-- change value type -->
        <div class="flex gap-1.5">
          <button class="primary-button py-1.5 text-sm rounded-lg">CO<sup>2</sup></button>
          <button class="primary-button py-1.5 text-sm rounded-lg">CO</button>
          <button class="primary-button py-1.5 text-sm rounded-lg">NO</button>
        </div>

        <!-- change device -->
        <div class="flex gap-1.5">
          <button v-on:click="changeDevice(1)" :class="{active: idActive == 1}" class="primary-button py-1.5 text-sm rounded-lg">Device A</button>
          <button v-on:click="changeDevice(2)" :class="{active: idActive == 2}" class="primary-button py-1.5 text-sm rounded-lg">Device B</button>
          <button v-on:click="changeDevice(3)" :class="{active: idActive == 3}" class="primary-button py-1.5 text-sm rounded-lg">Device C</button>
        </div>
      </div>

      <!-- body charts -->
       <apexcharts width="100%" height="500" type="line" :options="options" :series="series"/>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      series: [
        {
          name: 'Sales',
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
        },
      ],
      options: {
        chart: {
          type: "line"
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        },
      },
    }
  },
}
</script>

<style>
.card {
  padding: 10px;
  border-radius: 5px;
  background-color: #0a3243;
}

.active {
  background-color: green;
}

.primary-button {
  background-color: #7AE2CF;
  border-radius: 5px;
  min-width: 100px;
  transition: all 150ms ease-in;
}

.primary-button:hover, .active {
  background-color: #077A7D;
  color: #F5EEDD;
}
</style>
