<template>
    <div
        id="standings"
        :class="embedView ? 'embed' : 'page-view'"
    >

        <div class="row">
            <slot name="embedContent" />
            <div v-if="!embedView" class="content">
                <h1>Driver</h1>
                <p>Driver info</p>
            </div>
        </div>
        <div class="row">
            <div
                class="standings"
                :class="embedView ? 'flex-layout' : 'grid-layout'"
            >
                <div v-if="$grid.lg && !embedView" class="wrapper">
                    <router-link 
                        v-for="item in driverData"
                        :key="item" 
                        :to="'/driver/' + item.Driver.driverId" 
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
                        v-for="item in driverData" :key="item">
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
import {Swiper, SwiperSlide} from 'swiper/vue';
import axios from 'axios';
import 'swiper/css';

export default {
    name: 'VueDriver',
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
            driverData: null,
        };
    },
    mounted() {
        const name = window.location.pathname.split("/").pop();
        this.getDriverStanding(this.slugToString(name));

        setTimeout(() => {
            this.addTilt();
        }, 1000);
    },
    methods: {
        getDriverStanding(name) {
            let data = localStorage.getItem('driver' + name)
            const version = localStorage.getItem('driverVersion' + name)

            const date = new Date();
            const combinedDate =
                date.getHours() + '/' +
                date.getDay() + '/' +
                date.getMonth() + '/' +
                date.getFullYear();

            if (!version || version !== combinedDate) {
                axios.get('https://v1.formula-1.api-sports.io/drivers?search=' + name, {
                    headers: {
                        "x-rapidapi-host": 'v1.formula-1.api-sports.io',
                        "x-rapidapi-key": '22d70395d894e3afd88a76045ff574b1'
                    }
                })
                    .then(response => {
                        // handle success
                        data = response.data;
                        localStorage.setItem('driver' + name, data)
                        localStorage.setItem('driverVersion' + name, combinedDate)
                        this.driversData = data;
                    })
                    .catch(error => {
                        // handle error
                        console.log(error);
                    });
            } else {
                this.driversData = data;
            }
          
        },
        scrollToTop() {
            window.scrollTo(0,0);
        },
        slugToString(slug) {
            return slug.split("-").slice(-1)[0];
        },
    }
};
</script>