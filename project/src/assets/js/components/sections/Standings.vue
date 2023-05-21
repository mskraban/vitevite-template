<template>
    <div
        id="standings"
        :class="embedView ? 'embed' : 'page-view'"
    >

        <div class="row">
            <slot name="embedContent" />
            <div v-if="!embedView" class="content">
                <h1>Standings</h1>
                <p>The F1 top driver standings rank the most successful drivers in the Formula One World Championship
                    based on points earned in each race.</p>
            </div>
        </div>
        <div class="row">
            <div
                class="standings"
                :class="embedView ? 'flex-layout' : 'grid-layout'"
            >
                <div v-if="$grid.lg && !embedView" class="wrapper">
                    <div v-for="item in driversData" :key="item" class="standings-card">
                        <div
                            class="driver-img team-gradient"
                            :class="item.Constructor.constructorId"
                        >
                            <img
                                :src="getDriverImage(item.Driver.driverId)"
                                :alt="item.Driver.GivenName + ' ' + item.Driver.FamilyName"
                                loading="lazy"
                            >
                        </div>
                        <div class="driver-name">
                            {{ item.Driver.GivenName }}
                            {{ item.Driver.FamilyName }}
                        </div>
                        <div class="driver-pts">
                            <span class="pts-count">{{ item.points }}</span>
                            <span class="pts-copy">pts</span>
                        </div>
                    </div>
                </div>
                <swiper
                    v-else
                    slides-per-view="auto"
                    :centered-slides="true"
                    :space-between="24"
                    :breakpoints="{
                        768: {
                            slidesPerView: 3,
                            centeredSlides: false,
                        },
                    }"
                >
                    <swiper-slide
                        v-for="item in driversData" :key="item">
                        <div class="standings-card">
                            <div
                                class="driver-img team-gradient"
                                :class="item.Constructor.constructorId"
                            >
                                <img
                                    :src="getDriverImage(item.Driver.driverId)"
                                    :alt="item.Driver.GivenName + ' ' + item.Driver.FamilyName">
                            </div>
                            <div class="driver-name">
                                {{ item.Driver.GivenName }}
                                {{ item.Driver.FamilyName }}
                            </div>
                            <div class="driver-pts">
                                <span class="pts-count">{{ item.points }}</span>
                                <span class="pts-copy">pts</span>
                            </div>
                        </div>
                    </swiper-slide>
                </swiper>

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
import {Swiper, SwiperSlide} from 'swiper/vue';
import axios from 'axios';
import parser from 'xml2json-light'
import 'swiper/css';

export default {
    name: 'VueStandings',
    components: {
        Swiper,
        SwiperSlide,
    },
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
            // trigger endpoint after first page load, set version
            // save date instead of version
            // refresh content every day - if there is 1 day diff

            if (!version || version !== combinedDate) {
                axios.get('http://ergast.com/api/f1/current/driverStandings')
                    .then(response => {
                        // handle success
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