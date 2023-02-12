<template>
    <nav
        :class="expanded ? 'nav-expanded' : ''"
    >
        <div class="logo">Utility tools</div>
        <div class="nav-container">
            <router-link to="/" @click="closeExpand">Home</router-link>
            <router-link to="/percentage-calculator" @click="closeExpand">Percentage calculator</router-link>
            <router-link to="/temperature-converter" @click="closeExpand">Temperature converter</router-link>
        </div>
        <div 
            class="menu-icon d-inline-flex d-md-none" 
            @click="toggleExpand">
            <input class="menu-icon__cheeckbox" type="checkbox" />
            <div>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>
</template>

<script>

export default {
    name: 'VueNavigation',
    data() {
        return {
            expanded: false,
        };
    },
    methods: {
        toggleExpand() {
            this.expanded = this.expanded === false;
        },
        closeExpand() {
            this.expanded = false;
        }
    },
};
</script>