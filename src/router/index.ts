import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Redirect from '../components/Redirect.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/:shortCode',
      name: 'redirect',
      component: Redirect
    }
  ]
});

export default router;
