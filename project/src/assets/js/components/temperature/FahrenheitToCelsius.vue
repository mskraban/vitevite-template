<template>
    <div class="percent-calc calc-01">
        <div class="calc-01">
            <div class="title">Fahrenheit to celsius</div>
            <div class="calc">
                <span class="copy">What is</span>
                <input
                    v-model="number01"
                    type="number"
                    class="number-01"
                    @input="convertTemperature"
                >
                <span class="copy">°F in Celsius?</span>

                <span class="result">
                    {{ animatedResult }} °C
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import gsap from "gsap";

export default {
    name: 'FahrenheitToCelsius',
    data() {
        return {
            number01: null,
            number02: null,
            result: 0,
            tweenedNumber: 0,
        };
    },
    computed: {
        animatedResult: function() {
            return this.tweenedNumber.toFixed(1);
        }
    },
    watch: {
        result: function(newValue) {
            gsap.to(this.$data, { duration: 0.5, tweenedNumber: newValue });
        }
    },
    methods: {
        convertTemperature() {
            this.result = (this.number01 - 32) * (5/9);
        },
    },
};
</script>