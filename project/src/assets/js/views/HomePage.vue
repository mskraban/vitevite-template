<template>
    <div class="home">
        <section id="hero">
            <div class="content">
                <h1>Next F1 race in:</h1>
                <p>14 days 13 hours 54min 43s</p>
                <a href="#" class="btn btn-red">See more</a>
            </div>
        </section>
        <vue-standings
            :embed-view="true"
        >
        </vue-standings>
        <vue-calendar/>
    </div>
</template>

<script>
import VueStandings from "../components/sections/Standings.vue";
import VueCalendar from "../components/sections/Calendar.vue";
export default {
    components: {VueStandings, VueCalendar}
}

</script>