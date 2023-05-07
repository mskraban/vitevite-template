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
            <template #embedContent>
                <div class="content">
                    <h2>Standings</h2>
                    <p>The F1 top 3 driver standings rank the most successful drivers in the Formula One World
                        Championship based on points earned in each race.</p>
                </div>
            </template>
        </vue-standings>
      
        <vue-calendar/>

        <vue-teams
            :embed-view="true"
        >
            <template #embedContent>
                <div class="content">
                    <h3>Teams</h3>
                    <p>Complete list of 2023 F1 teams</p>
                </div>
            </template>
        </vue-teams>
    </div>
</template>

<script>
import VueStandings from "../components/sections/Standings.vue";
import VueCalendar from "../components/sections/Calendar.vue";
import VueTeams from "../components/sections/Teams.vue";

export default {
    components: {VueStandings, VueCalendar, VueTeams}
}

</script>