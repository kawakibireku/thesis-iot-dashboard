<script>
export { default } from '$app/router.vue';
import "./base.css"

export function configure({ app, router, isClient }) {
  if(isClient)
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