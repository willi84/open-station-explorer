import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import StationView from '@/views/StationView.vue'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/station/:id', name: 'station', component: StationView, props: true },
  ]
})

export default router
