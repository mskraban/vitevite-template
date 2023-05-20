<template>
    <section id="hero">
        <picture>
            <source srcset="src/assets/images/01_hero.webp" type="image/webp">
            <source srcset="src/assets/images/01_hero.jpg" type="image/jpeg">
            <img src="src/assets/images/01_hero.jpg" alt="Haas at Spielberg F1 Qualification 2022" rel="preload">
        </picture>
        <div class="content">
            <h1>Next F1 race in:</h1>
            <vue-countdown v-slot="{ days, hours, minutes, seconds }" :time="getNextRaceDate()">
                <p>{{ days }} days {{ hours }} hours {{ minutes }}min {{ seconds }}s</p>
            </vue-countdown>
            <a href="#" class="btn btn-red">See more</a>
        </div>
    </section>
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
        },
        getNextRaceDate() {
            const now = new Date();
            const nextRaceDate = new Date(`${this.nextRace.Date}T${this.nextRace.Time}`);

            return nextRaceDate - now;
        },
    },
};
</script>