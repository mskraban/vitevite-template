import { createApp } from 'vue'
import {createRouter, createWebHistory} from 'vue-router'
import '../scss/main.scss'
import App from './components/App.vue'

import Home from './views/HomePage.vue'
import About from './views/AboutPage.vue'
import Brazil from './views/BrazilPage.vue'

const routes = [
    {path: '/', name: 'Home', component: Home},
    {path: '/about', name: 'About', component: About},
    {path: '/brazil', name: 'Brazil', component: Brazil},
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

createApp(App)
    .use(router)
    .mount('#app')











