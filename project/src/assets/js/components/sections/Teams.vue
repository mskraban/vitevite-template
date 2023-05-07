<template>
    <div
        id="teams"
        class="container"
        :class="embedView ? 'embed' : 'page-view'"
    >

        <div class="row">
            <slot name="embedContent" />
            <div v-if="!embedView" class="content">
                <h1>Teams</h1>
                <p>Complete list of 2023 F1 teams</p>
            </div>
        </div>
        <div class="row">

            <div class="col-12">
                <div class="teams">
                    <div class="team team-color mercedes">
                        <div class="team-logo">
                            <img src="" alt="">
                        </div>
                        <div class="team-name text-white">MERCEDES</div>
                        <span class="more">See more</span>
                    </div>
                </div>
            </div>

            <div class="col-12">
                <router-link
                    v-if="embedView"
                    to="/standings"
                    class="btn btn-white"
                    @click="scrollToTop"
                >
                    Full standings
                </router-link>
            </div>
        </div>
    </div>
</template>


<script>
const driverImages = import.meta.glob("/src/assets/images/drivers/2023/*")
import axios from 'axios';
import parser from 'xml2json-light'
import 'swiper/css';

export default {
    name: 'VueTeams',
    props: {
        embedView: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            expanded: false,
            driversData: null,
        };
    },
    mounted() {
        this.getDriverStandings();
        this.getDriverImage('norris');
    },
    methods: {
        getDriverStandings() {
            let data = localStorage.getItem('driverStandings')
            const version = localStorage.getItem('driverStandingsVersion')

            const date = new Date();
            const combinedDate =
                date.getHours() + '/' +
                date.getDay() + '/' +
                date.getMonth() + '/' +
                date.getFullYear();
            console.log(version)
            console.log(combinedDate)
            // trigger endpoint after first page load, set version
            // save date instead of version
            // refresh content every day - if there is 1 day diff

            if (!version || version !== combinedDate) {
                axios.get('http://ergast.com/api/f1/current/driverStandings')
                    .then(response => {
                        // handle success
                        console.log(response.data);
                        data = response.data;
                        localStorage.setItem('driverStandings', data)
                        localStorage.setItem('driverStandingsVersion', combinedDate)
                        this.driversData = this.parseXml(data);
                        this.driversData = this.driversData.MRData.StandingsTable.StandingsList.DriverStanding;
                    })
                    .catch(error => {
                        // handle error
                        console.log(error);
                    });
            } else {
                this.driversData = this.parseXml(data);
                this.driversData = this.driversData.MRData.StandingsTable.StandingsList.DriverStanding;
            }
          
        },
        parseXml(xmlData) {
            return parser.xml2json(xmlData);
        },
        getDriverImage(driverName) {
            const drivers = Object.keys(driverImages);
            const matchedDriver = drivers.findIndex(element => element.includes(driverName))

            return drivers[matchedDriver];
        },
        scrollToTop() {
            window.scrollTo(0,0);
        },
    }
};
</script>