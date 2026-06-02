import { createRouter, createWebHistory } from 'vue-router'
import LibraryView from '../views/LibraryView.vue'
import SearchView from '../views/SearchView.vue'
import GameDetailView from '../views/GameDetailView.vue'
import StatsView from '../views/StatsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'library', component: LibraryView },
    { path: '/search', name: 'search', component: SearchView },
    { path: '/games/:id', name: 'game-detail', component: GameDetailView, props: true },
    { path: '/stats', name: 'stats', component: StatsView },
  ],
})

export default router
