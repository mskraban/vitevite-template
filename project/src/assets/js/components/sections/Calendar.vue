<template>
    <div
        id="calendar" 
        :class="embedView ? 'embed' : 'page-view'"
    >
        <div class="container">
            <div class="row">
                <div class="content">
                    <component :is="embedView ? 'h3' : 'h1'" >
                        Calendar
                    </component>
           
                    <p>The F1 calendar is a schedule of all the races that take place in the 
                        Formula One World Championship season.</p>
                </div>
            </div>
            <div class="row">
                <div class="events">
                    <div class="swiper-container">
                        <swiper
                            :modules="modules"
                            :centered-slides="true"
                            :breakpoints="{
                                0: {
                                    slidesPerView: 'auto',
                                    spaceBetween: 24,
                                    pagination: {
                                        el: '.swiper-pagination-custom',
                                        dynamicBullets: true,
                                    },
                                },
                                768: {
                                    slidesPerView: 4,
                                    centeredSlides: false,
                                    grid: {
                                        rows: 2,
                                    },
                                    allowTouchMove: false,

                                },
                            }"
                        >
                            <swiper-slide
                                v-for="item in calendarData"
                                v-show="isPastDate(item.Date)"
                                :key="item.Circuit.circuitId"
                            >
                                <a
                                    :href="'calendar/' + slugify(item.Circuit.Location.Country)"
                                    class="event-card"
                                    @click="scrollToTop"
                                >
                                    <div class="event-img">
                                        <img :src="getCountryFlag(slugify(item.Circuit.Location.Country))" alt="Bahrain">
                                    </div>
                                    <div class="event-country">{{ item.Circuit.Location.Country }}</div>
                                    <div class="event-date">
                                        <span class="event-weekend-date"></span>
                                        <span class="event-month">
                                            {{ getRaceDay(item.Date) }} {{ getMonthName(item.Date) }}
                                        </span>
                                    </div>
                                </a>
                            </swiper-slide>
                        </swiper>
                        <div class="swiper-pagination-custom"></div>
                    </div>
                    <router-link
                        v-if="embedView"
                        class="btn btn-dark"
                        to="/calendar"
                        @click="scrollToTop"
                    >
                        See more
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const countryFlags = import.meta.glob("/src/assets/images/countries/2023/*")
import { Swiper, SwiperSlide } from 'swiper/vue';
import {Grid, Pagination} from 'swiper';
import 'swiper/css/grid';
import 'swiper/css';
import 'swiper/css/pagination';
import axios from "axios";
import parser from "xml2json-light";

export default {
    name: 'VueCalendar',
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
    setup() {
        return {
            modules: [Grid, Pagination],
        };
    },
    data() {
        return {
            expanded: false,
            calendarData: null,
        };
    },
    beforeMount() {
        this.getCalendarList();
    },
    methods: {
        getCalendarList() {
            let data = localStorage.getItem('calendar')
            const version = localStorage.getItem('calendarVersion')

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
                axios.get('https://ergast.com/api/f1/current')
                    .then(response => {
                        // handle success
                        data = response.data;

                        this.calendarData = this.parseXml(data);
                        this.calendarData = this.calendarData.MRData.RaceTable.Race;

                        localStorage.setItem('calendar', data)
                        localStorage.setItem('calendarVersion', combinedDate)
                    })
                    .catch(error => {
                        // handle error
                        console.log(error);
                    });
            } else {
                this.calendarData = this.parseXml(data);
                this.calendarData = this.calendarData.MRData.RaceTable.Race;
            }
        },
        parseXml(xmlData) {
            return parser.xml2json(xmlData);
        },
        slugify(str) {
            str = str.replace(/^\s+|\s+$/g, '');
            str = str.toLowerCase();
            str = str.replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            return str;
        },
        getCountryFlag(countryName) {
            const countries = Object.keys(countryFlags);
            const matchedCountry = countries.findIndex(element => element.includes(countryName))

            return countries[matchedCountry];
        },
        getMonthName(dateString) {
            const date = new Date(dateString);
            return date.toLocaleString('en-us', { month: 'short' });
        },
        getRaceDay(dateString) {
            const date = new Date(dateString);
            return date.toLocaleString('en-us', { day: 'numeric' });
        },
        isPastDate(dateString) {
            const selectedDate = new Date(dateString);
            const now = new Date();

            if (this.embedView) {
                return selectedDate > now;
            } else {
                return true;
            }
        },
        scrollToTop() {
            window.scrollTo(0,0);
        },
        toggleRoute() {
            this.$router.push({ path: '/calendar' })
        },
    },
};
</script>