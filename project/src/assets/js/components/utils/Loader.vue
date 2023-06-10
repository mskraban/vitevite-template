<template>
    <div class="loader-body">
        <span class="loader"></span>
    </div>
</template>

<script>

export default {
    name: 'VueLoader',
    data() {
        return {
            expanded: false,
            windowTop: 0,
            slimNavbar: false,
        };
    },
    watch: {
        windowTop () {
            if (this.windowTop > 100) {
                if (!this.slimNavbar) {
                    this.slimNavbar = true;
                }
            } else {
                if (this.slimNavbar) {
                    this.slimNavbar = false;
                }
            }
        }
    },
};
</script>