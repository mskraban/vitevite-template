<template>
    <div class="page">
        <vue-navigation/>
      
        <router-view v-slot="{ Component }">
            <transition
                name="fade"
                mode="out-in"
            >
                <component :is="Component" />
            </transition>
        </router-view>

        <vue-footer/>
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