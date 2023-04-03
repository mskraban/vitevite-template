<template>
    <div id="standings">
        <div class="row">
            <div class="content">
                <h2>Standings</h2>
                <p>Top 3 drivers standings</p>
            </div>
        </div>
        <div class="row">
            <div class="standings">
                <div class="standings-card">
                    <div class="driver-img mercedes">
                        <img :src="drivers[0]" alt="Lewis Hamilton">
                    </div>
                    <div class="driver-name">
                        Lewis Hamilton
                    </div>
                    <div class="driver-pts">
                        <span class="pts-count">8</span>
                        <span class="pts-copy">pts</span>
                    </div>
                </div>

                <div class="standings-card">
                    <div class="driver-img ferrari">
                        <img :src="drivers[1]" alt="Charles Leclerc">
                    </div>
                    <div class="driver-name">
                        Charles Leclerc
                    </div>
                    <div class="driver-pts">
                        <span class="pts-count">6</span>
                        <span class="pts-copy">pts</span>
                    </div>
                </div>

                <div class="standings-card">
                    <div class="driver-img redbull">
                        <img :src="drivers[2]" alt="Max Verstappen">
                    </div>
                    <div class="driver-name">
                        Max Verstappen
                    </div>
                    <div class="driver-pts">
                        <span class="pts-count">4</span>
                        <span class="pts-copy">pts</span>
                    </div>
                </div>
            </div>
            <a href="#" class="btn btn-white">Full standings</a>
        </div>
    </div>
</template>

<script>
import driver01 from '../../../images/lewis.png'
import driver02 from '../../../images/charles.png'
import driver03 from '../../../images/max.png'

export default {
    name: 'VueStandings',
    data() {
        return {
            drivers: [driver01, driver02, driver03],
            expanded: false,
        };
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
            window.scrollTo(0, 0);
        }
    },
};
</script>