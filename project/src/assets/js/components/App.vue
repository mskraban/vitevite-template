<template>
    <div class="page">
        <vue-navigation/>
      
        <transition
            name="fade"
            mode="out-in"
        >
            <router-view></router-view>
        </transition>
    </div>
</template>