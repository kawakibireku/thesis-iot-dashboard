<script>
export { default } from '$app/router.vue';
import { createApp } from 'vue';
import "./base.css"
import VueApexCharts from "vue3-apexcharts";

export function configure({ app, router }) {
  const appInit = createApp(app)
  appInit.use(VueApexCharts)
  // Define routes for our application
  router.addRoute({
    path: '/',
    component: () => import('./pages/dashboard.vue'),
  });

  // Redirect root to dashboard
  router.addRoute({
    path: '/',
    redirect: '/dashboard',
  });
}
</script>
