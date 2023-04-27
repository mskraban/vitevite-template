<template>
    <div id="standings">
        <div class="row">
            <div class="content">
                <h2>Standings</h2>
                <p>The F1 top 3 driver standings rank the most successful drivers in the Formula One World Championship
                    based on points earned in each race.</p>
            </div>
        </div>
        <div class="row">
            <div class="standings">
                <swiper
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
                    <swiper-slide>
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
                    </swiper-slide>

                    <swiper-slide>
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
                    </swiper-slide>

                    <swiper-slide>
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
                    </swiper-slide>
                    <swiper-slide>
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
                    </swiper-slide>
                    <swiper-slide>
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
                    </swiper-slide>
                    <swiper-slide>
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
                    </swiper-slide>
                    <swiper-slide>
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
                    </swiper-slide>
                    <swiper-slide>
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
                    </swiper-slide>
                </swiper>
                <a href="#" class="btn btn-white">Full standings</a>
            </div>
        </div>
    </div>
</template>

<script>
import driver01 from '../../../images/lewis.png'
import driver02 from '../../../images/charles.png'
import driver03 from '../../../images/max.png'
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
            drivers: [
                driver01, 
                driver02, 
                driver03,
            ],
            expanded: false,
            driversData: null,
        };
    },
    mounted() {
        this.getDriverStandings();
    },
    methods: {
        getDriverStandings() {
            const currentVersion = 2
            let data = localStorage.getItem('driverStandings')
            const version = localStorage.getItem('driverStandingsVersion')

            // trigger endpoint after first page load, set version
            // save date instead of version
            // refresh content every day - if there is 1 day diff
          
            this.driversData = this.parseXml(data);

            if (!version || version < currentVersion) {
                axios.get('http://ergast.com/api/f1/current/driverStandings')
                    .then(response => {
                        // handle success
                        console.log(response.data);
                        data = response.data;
                        localStorage.setItem('driverStandings', data)
                        localStorage.setItem('driverStandingsVersion', currentVersion)
                    })
                    .catch(error => {
                        // handle error
                        console.log(error);
                    });
            }
        },
        parseXml(xmlData) {
            return parser.xml2json(xmlData);
        }
    }
};
</script>