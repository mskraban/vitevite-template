<template>
    <div class="home">
        <section id="hero">
            <div class="content">
                <h1>Next F1 race in:</h1>
                <p>14 days 13 hours 54min 43s</p>
                <a href="#" class="btn btn-red">See more</a>
            </div>
        </section>
        <vue-standings/>
    </div>
</template>

<script>
import VueStandings from "../components/sections/Standings.vue";
export default {
    components: {VueStandings}
}

</script>