<script setup>
  import { ref, watch } from 'vue';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css'
  import DevicesContainer from './devices-container.vue';
  import DevicesCharts from "./devices-charts.vue"

  const date = ref();

  const deviceSelected = ref(1)
  const typeSelected = ref(1)

  function changeDevice(id) {
    if (id !== deviceSelected.value) {
      deviceSelected.value = id
    }
  }

  function changeType(id) {
    if (id !== typeSelected.value) {
        typeSelected.value = id
    }
  }

  function handleDate(modelDate) {
    date.value = modelDate
  }

  watch(date, async (newDate) => {
    
    console.log("selected date: ", newDate[0])
  })

</script>

<template>
    <div class="container mx-auto py-5 gap-5">
    <VueDatePicker class="mb-5 !w-[350px] float-right !z-20" @update:model-value="handleDate()" :enable-time-picker="false" range="true" v-model="date"></VueDatePicker>
    <!-- device information -->
    <DevicesContainer class="mb-5" />
    <!-- device charts -->
    <div class="card col-span-3">
      <!-- header charts -->
      <div class="flex justify-between mb-10">
        <!-- change value type -->
        <div class="flex gap-1.5">
          <button v-on:click="changeType(1)" :class="{active: typeSelected == 1}" class="primary-button py-1.5 text-sm rounded-lg">CO<sup>2</sup></button>
          <button v-on:click="changeType(2)" :class="{active: typeSelected == 2}" class="primary-button py-1.5 text-sm rounded-lg">CO</button>
          <button v-on:click="changeType(3)" :class="{active: typeSelected == 3}" class="primary-button py-1.5 text-sm rounded-lg">NO</button>
        </div>

        <!-- change device -->
        <div class="flex gap-1.5">
          <button v-on:click="changeDevice(1)" :class="{active: deviceSelected == 1}" class="primary-button py-1.5 text-sm rounded-lg">Device A</button>
          <button v-on:click="changeDevice(2)" :class="{active: deviceSelected == 2}" class="primary-button py-1.5 text-sm rounded-lg">Device B</button>
          <button v-on:click="changeDevice(3)" :class="{active: deviceSelected == 3}" class="primary-button py-1.5 text-sm rounded-lg">Device C</button>
        </div>
      </div>

      <!-- body charts -->
      <DevicesCharts deviceId="deviceSelected" />
    </div>
  </div>
</template>

<script>
export const clientOnly = true

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
