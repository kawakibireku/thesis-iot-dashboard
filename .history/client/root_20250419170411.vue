<script>
export { default } from '$app/router.vue';
import "./base.css"
import VueApexCharts from "vue3-apexcharts"

const app = 

export function configure({ app, router }) {
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
