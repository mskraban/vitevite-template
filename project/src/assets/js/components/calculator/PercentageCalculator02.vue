<template>
    <div class="percent-calc calc-02">
        <div class="calc-01">
            <div class="title">Get percent out of two numbers</div>
            <div class="calc">
                <input
                    v-model="number01"
                    type="number"
                    class="number-01"
                    @input="calculatePercentage"
                >
                <span class="copy">is what percent of</span>
                <input
                    v-model="number02"
                    type="number"
                    class="number-02"
                    @input="calculatePercentage"
                >
                <span class="result">
                    Result: {{ animatedResult }}%
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import gsap from "gsap";

export default {
    name: 'PercentageCalculator02',
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
            return this.tweenedNumber;
        },
    },
    watch: {
        result: function (newValue) {
            gsap.to(this.$data, {duration: 0.5, tweenedNumber: newValue});
        },
    },
    methods: {
        calculatePercentage() {
            if (this.number01 != null && this.number02 != null) {
                this.result = (this.number01 * 100) / this.number02;
            }
        },
    },
};
</script>