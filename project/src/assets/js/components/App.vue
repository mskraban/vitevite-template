<template>
    <div class="counter-app">
        <h1>{{ heading }}</h1>

        <button
            @click="increaseCounter"
        >
            Click me
        </button>

        <transition
            name="slide-fade"
            mode="out-in">
            <span :key="counterValue" class="counter-outside">{{ counterValue }}</span>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'HelloWorld',
    props: {
        heading: {
            type: String,
            default: 'Counter',
        },
    },
    data() {
        return {
            counterValue: 0,
        };
    },
    methods: {
        increaseCounter() {
            this.counterValue = this.counterValue + 1;
        },
    },
};
</script>