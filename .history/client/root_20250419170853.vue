<script>
export { default } from '$app/router.vue';
import "./base.css"

export function configure({ app, router, isClient }) {
  if (isClient) {
    const VueApexCharts = require("vue3-apexcharts").default;
    app.component('apexchart', VueApexCharts);
  }
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
