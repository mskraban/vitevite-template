import { createApp } from 'vue'
import {createRouter, createWebHistory} from 'vue-router'
import '../scss/main.scss'
import App from './components/App.vue'
import { defineCustomElement } from 'vue'

// Vue utility components
import percentageCalculator01 from "./components/calculator/PercentageCalculator01.vue";
import percentageCalculator02 from "./components/calculator/PercentageCalculator02.vue";
import celsiusToFahrenheit from "./components/temperature/CelsiusToFahrenheit.vue";

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
    {path: '/', name: 'Home', component: Home},
    {path: '/percentage-calculator', name: 'Percentage calculator', component: PercentCalcPage},
    {path: '/temperature-converter', name: 'TempConvert', component: TempConvert},
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
    .component('PercentageCalculator01', percentageCalculator01)
    .component('PercentageCalculator02', percentageCalculator02)
    .component('CelsiusToFahrenheit', celsiusToFahrenheit)
    .mount('#app')











