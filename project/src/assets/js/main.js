import { createApp } from 'vue'
import {createRouter, createWebHistory} from 'vue-router'
import '../scss/main.scss'
import VueScreen from 'vue-screen';
import App from './components/App.vue'

// Vue utility Components
import Navigation from './components/navigation/Navigation.vue'
import Footer from './components/navigation/Footer.vue'

// Vue section Components
import Standings from './components/sections/Standings.vue'
import Calendar from './components/sections/Calendar.vue'
import Teams from './components/sections/Teams.vue'

// Vue pages
import Home from './views/HomePage.vue'

const routes = [
    {
        path: '/',
        name: 'Next F1 Race',
        component: Home
    },
    {
        path: '/standings',
        name: 'Standings',
        component: Standings
    },
    {
        path: '/calendar',
        name: 'Calendar',
        component: Calendar
    },
    {
        path: '/teams',
        name: 'Teams',
        component: Teams
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Load meta data
router.beforeEach((to, from, next) => {
    document.title = to.name;
    next();
});

createApp(App)
    .use(router)
    .use(VueScreen, 'bootstrap')
    .component('VueNavigation', Navigation)
    .component('VueFooter', Footer)
    .component('VueStandings', Standings)
    .component('VueCalendar', Calendar)
    .component('VueTeams', Teams)
    .mount('#app')




