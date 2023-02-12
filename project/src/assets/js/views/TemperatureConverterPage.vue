<template>
    <div class="temperature-converter-page">
        <h1>Temperature converter</h1>
        <p class="mb-5">Convert temperature.</p>
        <CelsiusToFahrenheit/>
        <FahrenheitToCelsius/>
        <CelsiusToKelvin/>
        <KelvinToCelsius/>
    </div>
</template>

<script setup>
import CelsiusToFahrenheit from '../components/temperature/CelsiusToFahrenheit.vue';
import FahrenheitToCelsius from '../components/temperature/FahrenheitToCelsius.vue';
import CelsiusToKelvin from '../components/temperature/CelsiusToKelvin.vue';
import KelvinToCelsius from '../components/temperature/KelvinToCelsius.vue';
</script>