<template>
    <div class="percent-calc calc-01">
        <div class="calc-01">
            <div class="title">Get number out of percent</div>
            <div class="calc">
                <span class="copy">What is</span>
                <input
                    v-model="number01"
                    type="number"
                    class="number-01"
                    @input="calculatePercentage"
                >
                <span class="copy">% of</span>
                <input
                    v-model="number02"
                    type="number"
                    class="number-02"
                    @input="calculatePercentage"
                >
                <span class="result">
                    Result: {{ animatedResult }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import gsap from "gsap";

export default {
    name: 'PercentageCalculator01',
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
        }
    },
    watch: {
        result: function(newValue) {
            gsap.to(this.$data, { duration: 0.5, tweenedNumber: newValue });
        }
    },
    methods: {
        calculatePercentage() {
            const percentValue = this.number01 / 100;
            this.result = percentValue * this.number02;
        },
    },
};
</script>