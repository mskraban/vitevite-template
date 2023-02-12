<template>
    <div class="temperature-converter-page">
        <h1>Temperature converter</h1>
        <p class="mb-5">Convert temperature.</p>
        <CelsiusToFahrenheit/>
        <FahrenheitToCelsius/>
    </div>
</template>

<script setup>
import CelsiusToFahrenheit from '../components/temperature/CelsiusToFahrenheit.vue';
import FahrenheitToCelsius from '../components/temperature/FahrenheitToCelsius.vue';
</script>