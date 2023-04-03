import { createApp } from 'vue'
import {createRouter, createWebHistory} from 'vue-router'
import '../scss/main.scss'
import App from './components/App.vue'
import { defineCustomElement } from 'vue'

// Vue utility Components
import Navigation from './components/navigation/Navigation.vue'

// Vue pages
import Home from './views/HomePage.vue'
import PercentCalcPage from './views/PercentCalcPage.vue'
import TempConvert from './views/TemperatureConverterPage.vue'
import About from './views/AboutPage.vue'


// Vue generates a new HTML element class from the component definition.
const AboutExample = defineCustomElement(About)

// Register the custom element so that it can be used as <dark-mode-switch>.
customElements.define('about-example', AboutExample)

const routes = [
    {
        path: '/',
        name: 'Next F1 Race',
        component: Home
    },
    {
        path: '/percentage-calculator',
        name: 'Percentage calculator',
        component: PercentCalcPage
    },
    {
        path: '/temperature-converter',
        name: 'Temperature converter',
        component: TempConvert
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
    .component('VueNavigation', Navigation)
    .mount('#app')











