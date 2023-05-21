<template>
    <div>
        <section id="hero">
            <picture>
                <source srcset="src/assets/images/countries/2023/backgrounds/monaco.jpg" type="image/jpeg">
                <img src="src/assets/images/countries/2023/backgrounds/monaco.jpg" alt="Monaco" rel="preload">
            </picture>
            <div
                class="content"
                :class="activeRace[0] ? 're-order' : ''"
            >
                <h1 v-if="activeRace[0]">{{ activeRace[0].RaceName }}</h1>
                <h1 v-else>Next F1 race in:</h1>

                <vue-countdown v-if="activeRace[0]" v-slot="{ hours, minutes, seconds }" :time="getNextRaceEventTime()">
                    <p>{{ hours }} hours {{ minutes }}min {{ seconds }}s</p>
                </vue-countdown>
                <vue-countdown v-else v-slot="{ days, hours, minutes, seconds }" :time="getNextRaceDate()">
                    <p>{{ days }} days {{ hours }} hours {{ minutes }}min {{ seconds }}s</p>
                </vue-countdown>

                <div v-if="activeRaceNextEvents[0]" class="country-title"> {{ activeRaceNextEvents[0][0] }} </div>
                <div v-else class="country-title">{{ getNextRaceCountry() }}</div>

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
                            <div
                                v-if="activeRace[0]"
                                class="next">
                                <div
                                    v-for="race in activeRaceNextEvents"
                                    :key="race[0]"
                                    class="race"
                                >
                                    <div class="info">
                                        <div class="grand-prix">{{ race[0] }}</div>
                                    </div>
                                    <div class="date">
                                        {{ getDayTime(race[1]) }}
                                    </div>
                                </div>
                            </div>
                            <div
                                v-else
                                class="next">
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
            activeRace: [],
            activeRaceNextEvents: [],
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
                this.calendarData.forEach((value) => {
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
            this.getActiveRace();
            this.getActiveRaceNextEvent();
        },
        getNextRaceDate() {
            const now = new Date();
            const nextRaceDate = new Date(`${this.nextRace.Date}T${this.nextRace.Time}`);

            return nextRaceDate - now;
        },
        getNextRaceCountry() {
            return this.nextRace.RaceName;
        },
        getActiveRace() {
            const now = new Date();

            if (this.calendarData) {
                this.calendarData.forEach((value) => {
                    const practiceDay = new Date(value.FirstPractice.Date);
                    const qualiDay = new Date(value.Qualifying.Date);
                    const raceDay = new Date(value.Date);

                    if (this.datesAreSameDay(practiceDay, now)
                        || this.datesAreSameDay(qualiDay, now)
                        || this.datesAreSameDay(raceDay, now)) {
                        this.activeRace.push(value);
                    }
                });
            
            }
        },
        getActiveRaceNextEvent() {
            const now = new Date();
            const allEvents = [];
            const upcomingEvents = [];

            if (this.activeRace[0]) {
                /* eslint-disable max-len */
                const p1 = [];
                const p2 = [];
                const p3 = [];
                const quali = [];
                const race = [];

                const p1Name = 'Practice 1';
                const p2Name = 'Practice 2';
                const p3Name = 'Practice 3';
                const qualiName = 'Qualifying';
                const raceName = 'Race';

                const p1Date = new Date(`${this.activeRace[0].FirstPractice.Date}T${this.activeRace[0].FirstPractice.Time}`);
                const p2Date = new Date(`${this.activeRace[0].SecondPractice.Date}T${this.activeRace[0].SecondPractice.Time}`);
                const p3Date = new Date(`${this.activeRace[0].ThirdPractice.Date}T${this.activeRace[0].ThirdPractice.Time}`);
                const qualiDate = new Date(`${this.activeRace[0].Qualifying.Date}T${this.activeRace[0].Qualifying.Time}`);
                const raceDate = new Date(`${this.activeRace[0].Date}T${this.activeRace[0].Time}`);
                /* eslint-enable max-len */

                p1.push(p1Name, p1Date);
                p2.push(p2Name, p2Date);
                p3.push(p3Name, p3Date);
                quali.push(qualiName, qualiDate);
                race.push(raceName, raceDate);

                allEvents.push(p1, p2, p3, quali, race);

                console.log(allEvents);

                allEvents.forEach((value, index) => {
                    if (value[1] > now) {
                        upcomingEvents.push(value);
                        console.log(value);
                        console.log(now);
                    }
                });

                return this.activeRaceNextEvents = upcomingEvents;
            }
        },
        getNextRaceEventTime() {
            const now = new Date();

            if (this.activeRaceNextEvents[0]) {
                const nextRaceTime = this.activeRaceNextEvents[0][1];
                return nextRaceTime - now;
            } else {
                return false;
            }
        },
        getMonthDay(date) {
            const selectedDate = new Date(date);
            return selectedDate.toLocaleString('en-us', { month: 'long' }) + ' ' +  selectedDate.getDate();
        },
        getDayTime(date) {
            const selectedDate = new Date(date);
            // eslint-disable-next-line max-len

            const day = selectedDate.toLocaleString('en-us', { weekday: 'long' });

            let hours = selectedDate.getHours()
            hours = ("0" + hours).slice(-2);

            let minutes = selectedDate.getMinutes()
            minutes = ("0" + minutes).slice(-2);

            return day + ' ' + hours +':'+  minutes;
        },
        slugify(str) {
            str = str.replace(/^\s+|\s+$/g, '');
            str = str.toLowerCase();
            str = str.replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            return str;
        },
        datesAreSameDay(first, second) {
            return first.getFullYear() === second.getFullYear() &&
                first.getMonth() === second.getMonth() &&
                first.getDate() === second.getDate();
        }
    },
};
</script>