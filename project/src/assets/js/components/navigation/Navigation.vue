<template>
    <nav
        :class="[expanded ? 'nav-expanded' : '', slimNavbar ? 'slim-navbar' : '']"
    >
        <div class="nav-container">
            <div class="logo">
                <img
                    :src="images[1]"
                    alt="Next F1 Race" />
            </div>
            <div
                :class="expanded ? 'nav-expanded' : ''"
                class="nav-links"
            >
                <router-link to="/" @click="closeExpand">Home</router-link>
                <router-link to="/standings" @click="closeExpand">Standings</router-link>
                <router-link to="/teams" @click="closeExpand">Teams</router-link>
                <router-link to="/tracks" @click="closeExpand">Tracks</router-link>
                <router-link to="/calendar" @click="closeExpand">Calendar</router-link>
                <router-link to="/drivers" @click="closeExpand">Drivers</router-link>
                <router-link to="/events" @click="closeExpand">Events</router-link>
                <router-link to="/news" @click="closeExpand">News</router-link>
            </div>
            <div
                class="menu-icon d-inline-flex d-md-none"
                @click="toggleExpand">
                <input class="menu-icon__cheeckbox" name="menu" type="checkbox"/>
                <label for="menu" class="d-none">Menu</label>
                <div>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import img01 from '../../../images/01_hero.jpg'
import img02 from '../../../images/flag.svg'

export default {
    name: 'VueNavigation',
    data() {
        return {
            images: [img01, img02],
            expanded: false,
            windowTop: 0,
            slimNavbar: false,
        };
    },
    watch: {
        windowTop () {
            if (this.windowTop > 200) {
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
    mounted() {
        window.addEventListener("scroll", this.onScroll)
    },
    beforeUnmount() {
        window.removeEventListener("scroll", this.onScroll)
    },
    methods: {
        toggleExpand() {
            this.expanded = this.expanded === false;
            this.scrollToTop();
        },
        closeExpand() {
            this.expanded = false;
            this.scrollToTop();
        },
        scrollToTop() {
            window.scrollTo(0,0);
        },
        onScroll(e) {
            this.windowTop = window.top.scrollY /* or: e.target.documentElement.scrollTop */
        }
    },
};
</script>