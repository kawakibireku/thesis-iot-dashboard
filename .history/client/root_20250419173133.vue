<script>
import { createRouter, createWebHistory } from 'vue-router';
import { createApp } from 'vue';
import App from './App.vue';
import "./base.css";

// Ensure this code only runs in the browser
if (typeof window !== 'undefined') {
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

  // Conditionally register VueApexCharts in the browser
  import("vue3-apexcharts").then((module) => {
    const VueApexCharts = module.default;
    app.component('apexchart', VueApexCharts);
  });

  // Use the router
  app.use(router);

  // Mount the app
  app.mount('#root');
}
</script>