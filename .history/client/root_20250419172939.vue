<script>
import { createRouter, createWebHistory } from 'vue-router';
import { createApp } from 'vue';
import App from './App.vue';
import "./base.css";

// Import VueApexCharts
import VueApexCharts from "vue3-apexcharts";

// Define routes for the SPA
const routes = [
  {
    path: '/',
    component: () => import('./pages/dashboard.vue'),
  },
  // Add other routes here if needed
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(), 
  routes,
});

// Create the Vue app
const app = createApp(App);

// Register VueApexCharts globally
app.component('apexchart', VueApexCharts);

// Use the router
app.use(router);

// Mount the app
app.mount('#root');
</script>