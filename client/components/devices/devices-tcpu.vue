<script setup lang="ts">
import { getThreshold } from '../../utils/threshold';
import { computed } from 'vue';

// Define props
const props = defineProps({
    devices: {
        type: Array,
        required: true,
    },
    error: {
        type: String,
        default: null,
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

// Use props.devices directly
const devices = computed(() => {
    return props.devices && props.devices.map(device => {
        const coThreshold = getThreshold(device.sensor.co);
        const no2Threshold = getThreshold(device.sensor.no2);
        return {
            ...device,
            sensor: {
                ...device.sensor,
                co_status: coThreshold.text,
                co_color: coThreshold.color,
                no2_status: no2Threshold.text,
                no2_color: no2Threshold.color,
            },
        };
    });
});
</script>

<template>
    <div v-if="error">
        <p class="text-center font-semibold text-xl text-red-500">
            Error: {{ error }}
        </p>
    </div>
    <div v-else-if="loading">
        <p class="text-center font-semibold text-xl">Loading data, please wait...</p>
    </div>
    <div class="rounded-lg bg-purple p-5 mb-5">
        <h1 class="text-2xl font-semibold text-gray-800 dark:text-white">ISPU (Indeks Standar Pencemar Udara)</h1>
        <div class="rounded-lg w-full flex justify-between gap-5 items-center justify-center">
        <div v-for="device in devices" :key="device.id" class="card flex-1 mt-4 p-4 bg-secondary rounded-lg shadow-md">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold text-gray-800 dark:text-white">{{ device.name }}</h2>
                <b class="text-white font-light text-gray-600">Range Indeks: <span class="font-semibold">2000</span></b>
            </div>
            <p class="text-gray-600 dark:text-gray-400">Status: {{ device.status }}</p>
            <p class="text-gray-600 dark:text-gray-400">Last Updated: {{ device.lastUpdated }}</p>
            <div class="mt-4 mx-auto bg-fit justify-around flex gap-2.5">
                <div>
                    <p class="block w-fit text-gray-600 dark:text-gray-400 text-lg font-regular">CO : <span class="text-[50px] font-semibold text-gray-200">{{ device.sensor.co }}</span></p>
                    <p class="text-gray-400 text-xs">Status: <span class="text-sm font-normal ml-2.5 text-white p-1 rounded-lg" :style="{background: device.sensor.co_color}">{{device.sensor.co_status}}</span></p>
                </div>
                <div>
                    <p class="block w-fit text-gray-600 dark:text-gray-400 text-lg font-regular">NO<sup>2</sup> : <span class="text-[50px] font-semibold text-gray-200">{{ device.sensor.no2 }}</span></p>
                    <p class="text-gray-400 text-xs">Status: <span class="text-sm font-normal ml-2.5 text-white p-1 rounded-lg" :style="{background: device.sensor.no2_color}">{{device.sensor.no2_status}}</span></p>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>