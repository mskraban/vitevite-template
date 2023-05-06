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

<script>
import { useGrid } from 'vue-screen'
export default {
    setup() {
        const grid = useGrid('bootstrap')

        return {
            grid
        }
    },
}
</script>