<template>
    <div id="calendar">
        <div class="container">
            <div class="row">
                <div class="content">
                    <h2>Calendar</h2>
                    <p>The F1 calendar is a schedule of all the races that take place in the 
                        Formula One World Championship season.</p>
                </div>
            </div>
            <div class="row">
                <div class="events">
                    <swiper
                        slides-per-view="auto"
                        :centered-slides="true"
                        :breakpoints="{
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
                        <swiper-slide>
                            <div class="event-card">
                                <div class="event-img">
                                    <img :src="country[0]" alt="Bahrain">
                                </div>
                                <div class="event-country">Bahrain</div>
                                <div class="event-date">
                                    <span class="event-weekend-date">18 - 20</span>
                                    <span class="event-month">mar</span>
                                </div>
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="event-card">
                                <div class="event-img">
                                    <img :src="country[1]" alt="Saudi arabia">
                                </div>
                                <div class="event-country">Saudi arabia</div>
                                <div class="event-date">
                                    <span class="event-weekend-date">25 - 27</span>
                                    <span class="event-month">mar</span>
                                </div>
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="event-card">
                                <div class="event-img">
                                    <img :src="country[2]" alt="Australia">
                                </div>
                                <div class="event-country">Australia</div>
                                <div class="event-date">
                                    <span class="event-weekend-date">08 - 10</span>
                                    <span class="event-month">apr</span>
                                </div>
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="event-card">
                                <div class="event-img">
                                    <img :src="country[3]" alt="Italy">
                                </div>
                                <div class="event-country">Italy</div>
                                <div class="event-date">
                                    <span class="event-weekend-date">22 - 24</span>
                                    <span class="event-month">apr</span>
                                </div>
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="event-card">
                                <div class="event-img">
                                    <img :src="country[4]" alt="United States">
                                </div>
                                <div class="event-country">United States</div>
                                <div class="event-date">
                                    <span class="event-weekend-date">06 - 08</span>
                                    <span class="event-month">may</span>
                                </div>
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="event-card">
                                <div class="event-img">
                                    <img :src="country[5]" alt="Spain">
                                </div>
                                <div class="event-country">Spain</div>
                                <div class="event-date">
                                    <span class="event-weekend-date">20 - 22</span>
                                    <span class="event-month">may</span>
                                </div>
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="event-card">
                                <div class="event-img">
                                    <img :src="country[6]" alt="Monaco">
                                </div>
                                <div class="event-country">Monaco</div>
                                <div class="event-date">
                                    <span class="event-weekend-date">27 - 29</span>
                                    <span class="event-month">may</span>
                                </div>
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="event-card">
                                <div class="event-img">
                                    <img :src="country[7]" alt="Azerbaijan">
                                </div>
                                <div class="event-country">Azerbaijan</div>
                                <div class="event-date">
                                    <span class="event-weekend-date">10 - 12</span>
                                    <span class="event-month">jun</span>
                                </div>
                            </div>
                        </swiper-slide>
                    </swiper>
                    <a href="#" class="btn btn-dark">See more</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import country01 from '../../../images/country_flags/country_bahrain.svg'
import country02 from '../../../images/country_flags/country_saudi.svg'
import country03 from '../../../images/country_flags/country_australia.svg'
import country04 from '../../../images/country_flags/country_italy.svg'
import country05 from '../../../images/country_flags/country_usa.svg'
import country06 from '../../../images/country_flags/country_spain.svg'
import country07 from '../../../images/country_flags/country_monaco.svg'
import country08 from '../../../images/country_flags/country_azerbaijan.svg'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Grid } from 'swiper';
import 'swiper/css/grid';
import 'swiper/css';

export default {
    name: 'VueCalendar',
    components: {
        Swiper,
        SwiperSlide,
    },
    setup() {
        return {
            modules: [Grid],
        };
    },
    data() {
        return {
            country: [
                country01, 
                country02, 
                country03, 
                country04, 
                country05, 
                country06, 
                country07,
                country08,
            ],
            expanded: false,
        };
    },
};
</script>