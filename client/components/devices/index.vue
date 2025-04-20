<script setup>
import { ref, watch, onMounted } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import DevicesContainer from './devices-container.vue';
import DevicesCharts from './devices-charts.vue';
import { getDeviceData } from '../../lib/fetch';

const today = new Date();
const startOfDay = new Date(today.setHours(0, 0, 0, 0));
const endOfDay = new Date(today.setHours(23, 59, 59, 999));
const date = ref([startOfDay, endOfDay]);

const deviceSelected = ref('ECG-1');
const typeSelected = ref('CO2');
const dataChart = ref(null);

async function changeDevice(id) {
  console.log(id);
  if (id !== deviceSelected.value) {
    deviceSelected.value = id;
    // Convert dates to ISO strings
    const startDate = date.value[0].toISOString().split('T')[0];
    const endDate = date.value[1].toISOString().split('T')[0];
    const response = await getDeviceData(
      deviceSelected.value,
      typeSelected.value,
      [startDate, endDate]
    );
    dataChart = response;
  }
}

async function changeType(id) {
  if (id !== typeSelected.value) {
    typeSelected.value = id;
    // Convert dates to ISO strings
    const startDate = date.value[0].toISOString().split('T')[0];
    const endDate = date.value[1].toISOString().split('T')[0];
    const response = await getDeviceData(
      deviceSelected.value,
      typeSelected.value,
      [startDate, endDate]
    );

    dataChart = response;
  }
}

async function handleDate(modelDate) {
  date.value = modelDate;
  // Convert dates to ISO strings
  const startDate = modelDate[0].toISOString().split('T')[0];
  const endDate = modelDate[1].toISOString().split('T')[0];
  const response = await getDeviceData(
    deviceSelected.value,
    typeSelected.value,
    [startDate, endDate]
  );

  dataChart = response;
}

watch(date, handleDate);
watch(deviceSelected, changeDevice);
watch(typeSelected, changeType);
onMounted(async () => {
  const startDate = date.value[0].toISOString().split('T')[0];
  const endDate = date.value[1].toISOString().split('T')[0];
  const response = await getDeviceData(
    deviceSelected.value,
    typeSelected.value,
    [startDate, endDate]
  );
  dataChart = response;
});
</script>

<template>
  <div class="container mx-auto py-5 gap-5">
    <VueDatePicker
      class="mb-5 !w-[350px] float-right !z-20"
      @update:model-value="handleDate()"
      :enable-time-picker="false"
      range="true"
      v-model="date"
    ></VueDatePicker>
    <!-- device information -->
    <DevicesContainer class="mb-5" />
    <!-- device charts -->
    <div class="card col-span-3">
      <!-- header charts -->
      <div class="flex justify-between mb-10">
        <!-- change value type -->
        <div class="flex gap-1.5">
          <button
            v-on:click="changeType('CO2')"
            :class="{ active: typeSelected == 'CO2' }"
            class="primary-button py-1.5 text-sm rounded-lg"
          >
            CO<sup>2</sup>
          </button>
          <button
            v-on:click="changeType('CO')"
            :class="{ active: typeSelected == 'CO' }"
            class="primary-button py-1.5 text-sm rounded-lg"
          >
            CO
          </button>
          <button
            v-on:click="changeType('NO')"
            :class="{ active: typeSelected == 'NO' }"
            class="primary-button py-1.5 text-sm rounded-lg"
          >
            NO
          </button>
        </div>

        <!-- change device -->
        <div class="flex gap-1.5">
          <button
            v-on:click="changeDevice('ECG-1')"
            :class="{ active: deviceSelected == 'ECG-1' }"
            class="primary-button py-1.5 text-sm rounded-lg"
          >
            ECG-1
          </button>
          <button
            v-on:click="changeDevice('ECG-2')"
            :class="{ active: deviceSelected == 'ECG-2' }"
            class="primary-button py-1.5 text-sm rounded-lg"
          >
            ECG-2
          </button>
          <button
            v-on:click="changeDevice('ECG-3')"
            :class="{ active: deviceSelected == 'ECG-3' }"
            class="primary-button py-1.5 text-sm rounded-lg"
          >
            ECG-3
          </button>
        </div>
      </div>

      <!-- body charts -->
      <DevicesCharts
        :deviceId="deviceSelected.value"
        :type="typeSelected.value"
        :startDate="date.value[0].toISOString().split('T')[0]"
        :endDate="date.value[1].toISOString().split('T')[0]"
        :chartData="dataChart?.chartData"
      />
    </div>
  </div>
</template>

<style>
.primary-button {
  background-color: transparent;
  color: #cd23b2;
  border-color: #cd23b2;
  border-radius: 5px;
  min-width: 100px;
  transition: all 150ms ease-in;
}

.primary-button:hover {
  cursor: pointer;
}

.active {
  animation: scale 150ms;
  transform: scale(1.1);
  background-image: linear-gradient(to bottom, #e14eca, #ba54f5) !important;
  color: var(--bg-primary);
}

@keyframes scale {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
}
</style>
