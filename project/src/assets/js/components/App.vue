<template>
    <div class="page">
        <nav>
            <div class="logo">Utility tools</div>
            <div class="nav-container">
                <router-link to="/">Home</router-link>
                <router-link to="/percentage-calculator">Percentage calculator</router-link>
                <router-link to="/temperature-converter">Temperature converter</router-link>
            </div>
        </nav>

        <div class="container">
            <transition
                name="fade"
                mode="out-in"
            >
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
</script>