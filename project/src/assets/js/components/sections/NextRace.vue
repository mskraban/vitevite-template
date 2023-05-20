<template>
    <div>
        <section id="hero">
            <picture>
                <source srcset="src/assets/images/countries/2023/backgrounds/monaco.jpg" type="image/jpeg">
                <img src="src/assets/images/countries/2023/backgrounds/monaco.jpg" alt="Monaco" rel="preload">
            </picture>
            <div class="content">
                <h1>Next F1 race in:</h1>
                <vue-countdown v-slot="{ days, hours, minutes, seconds }" :time="getNextRaceDate()">
                    <p>{{ days }} days {{ hours }} hours {{ minutes }}min {{ seconds }}s</p>
                </vue-countdown>
                <div class="country-title">{{ getNextRaceCountry() }}</div>
                <a href="#" class="btn btn-red">Upcoming events</a>
            </div>
            <span class="img-credit">Monaco, from
                <a href="https://unsplash.com/photos/1CkSNmbT7J0" target="_blank">Unsplash.com</a>
            </span>
        </section>
        <section id="upcoming">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="content">
                            <h2>Upcoming</h2>
                            <div class="next">
                                <a 
                                    v-for="race in nextRaces.slice(0, 3)"
                                    :key="race.Circuit.circuitId" 
                                    class="race"
                                    :href="'calendar/' + slugify(race.Circuit.Location.Country)"
                                >
                                    <div class="info">
                                        <div class="upper-title">Next race</div>
                                        <div class="grand-prix">{{ race.RaceName }}</div>
                                        <div class="circuit">{{ race.Circuit.CircuitName }}</div>
                                    </div>
                                    <div class="date">
                                        {{ getMonthDay(race.Date) }}
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import axios from "axios";
import parser from "xml2json-light";
import VueCountdown from '@chenfengyuan/vue-countdown';

export default {
    name: 'NextRace',
    components: {VueCountdown},
    props: {
        embedView: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            expanded: false,
            calendarData: null,
            nextRaces: [],
            nextRace: [],
        };
    },
    watch: {
        calendarData: function() {
            this.filterNextRaces();
        }
    },
    mounted() {
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
                axios.get('http://ergast.com/api/f1/current')
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
        filterNextRaces() {
            const now = new Date();

            if (this.calendarData) {
                this.calendarData.forEach((value, index) => {
                    const selectedDate = new Date(value.Date);

                    if (selectedDate > now) {
                        this.nextRaces.push(value);
                    }
                });

                this.getNextRace()
            }
        },
        getNextRace() {
            this.nextRace = this.nextRaces[0];

            this.getNextRaceDate();
            this.getNextRaceCountry();
        },
        getNextRaceDate() {
            const now = new Date();
            const nextRaceDate = new Date(`${this.nextRace.Date}T${this.nextRace.Time}`);

            return nextRaceDate - now;
        },
        getNextRaceCountry() {
            return this.nextRace.RaceName;
        },
        getMonthDay(date) {
            const selectedDate = new Date(date);
            return selectedDate.toLocaleString('en-us', { month: 'long' }) + ' ' +  selectedDate.getDate();
        },
        slugify(str) {
            str = str.replace(/^\s+|\s+$/g, '');
            str = str.toLowerCase();
            str = str.replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            return str;
        },
    },
};
</script>