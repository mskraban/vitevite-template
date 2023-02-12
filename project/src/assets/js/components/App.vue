<template>
    <div class="page">
        <vue-navigation/>

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