<script>
export { default } from '$app/router.vue';

export function configure({ app, router }) {
  // Define routes for our application
  router.addRoute({
    path: '/dashboard',
    component: () => import('./pages/dashboard.vue'),
  });

  // Redirect root to dashboard
  router.addRoute({
    path: '/',
    redirect: '/dashboard',
  });
}
</script>