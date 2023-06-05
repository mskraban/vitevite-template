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
                    <router-link
                        v-for="item in driversData"
                        :key="item"
                        :to="'/driver/' + slugify(item.Driver.GivenName + '-' + item.Driver.FamilyName)"
                        class="standings-card tilt"
                    >
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
                    </router-link>
                </div>
                <div v-else class="swiper-container">
                    <swiper
                        :modules="modules"
                        :centered-slides="true"
                        :space-between="24"
                        :navigation="true"
                        :pagination="true"
                        :breakpoints="{
                            0: {
                                slidesPerView: 'auto',
                                pagination: {
                                    el: '.swiper-pagination-custom-mobile',
                                    dynamicBullets: true,
                                },
                            },
                            768: {
                                slidesPerView: 3,
                                centeredSlides: false,
                                navigation: {
                                    nextEl: '.swiper-next',
                                    prevEl: '.swiper-prev',
                                },
                                pagination: {
                                    el: '.swiper-pagination-custom',
                                    dynamicBullets: true,
                                },
                                observer: true,
                                observeParents: true,
                                parallax:true,
                            },
                        }"
                    >
                        <swiper-slide
                            v-for="item in driversData" :key="item">
                            <router-link
                                :to="'/driver/' + slugify(item.Driver.GivenName + '-' + item.Driver.FamilyName)"
                                class="standings-card">
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
                            </router-link>
                        </swiper-slide>
                    </swiper>
                    <div class="swiper-next swiper-btn"></div>
                    <div class="swiper-prev swiper-btn"></div>
                    <div class="swiper-pagination-custom swiper-pagination-custom-mobile"></div>
                </div>
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
import { Navigation, Pagination } from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/vue';
import axios from 'axios';
import parser from 'xml2json-light'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import VanillaTilt from 'vanilla-tilt';

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
            modules: [Navigation, Pagination],
        };
    },
    beforeMount() {
        this.getDriverStandings();

        setTimeout(() => {
            this.addTilt();
        }, 1000);

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
                axios.get('https://ergast.com/api/f1/current/driverStandings')
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
        scrollToTop() {
            window.scrollTo(0,0);
        },
        addTilt() {
            if (this.$grid.lg) {
                VanillaTilt.init(document.querySelectorAll(".tilt"), {
                    max: 15,
                    speed: 400,
                    axis: 'x',
                    scale: 1.2,
                });
            }
        },
        slugify(str) {
            str = str.replace(/^\s+|\s+$/g, '');
            str = str.toLowerCase();
            str = str.replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            return str;
        },
        getDriverImage(name) {
            return new URL(`/src/assets/images/drivers/2023/${name}.webp`, import.meta.url).href
        },
    }
};
</script>