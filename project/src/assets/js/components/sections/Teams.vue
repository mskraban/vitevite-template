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
        <div
            v-if="embedView"
            class="row"
        >
            <div class="col-12 col-lg-6">
                <div class="teams">
                    <div
                        v-for="item in constructorsData" :key="item"
                        class="team team-color mercedes"
                        :class="item.Constructor.constructorId"
                        @mouseover="setActiveTeam(item.Constructor.constructorId, item.Constructor.Name)"
                        @click="toggleRoute"
                    >
                        <div class="team-logo">
                            <img
                                :src="getTeamImage(item.Constructor.constructorId)"
                                :alt="item.Constructor.Name"
                                loading="lazy"
                            >
                        </div>
                        <div class="team-name text-white">{{ item.Constructor.Name }}</div>
                        <span class="more">
                            <router-link
                                v-if="embedView"
                                to="/teams"
                                @click="scrollToTop"
                            >
                                See more
                            </router-link>
                        </span>
                    </div>
                </div>
            </div>
          
            <div 
                v-if="$grid.lg && activeTeam"
                class="col-12 col-lg-6"
            >
                <div class="active-team">
                    <transition
                        name="bounce"
                        mode="out-in"
                    >
                        <div
                            ref="teamLogo"
                            :key="activeTeam"
                            class="team-logo team-color"
                            :class="activeTeam"
                        >
                            <img
                                :src="getTeamImage(activeTeam)"
                                loading="lazy"
                                :alt="activeTeamName">
                    
                        </div>
                    </transition>
                </div>
            </div>


        </div>
        <div
            v-else
            class="row"
        >
            <div class="col-12 col-lg-12">
                <div class="teams">
                    <div
                        v-for="item in constructorsData" :key="item"
                        class="team"
                        @mouseover="setActiveTeam(item.Constructor.constructorId, item.Constructor.Name)"
                        @click="toggleRoute"
                    >
                        <div
                            class="car-card team-color"
                            :class="item.Constructor.constructorId"
                        >
                            <div class="team-logo">
                                <img
                                    :src="getTeamImage(item.Constructor.constructorId)"
                                    :alt="item.Constructor.Name"
                                    loading="lazy"
                                >
                            </div>
                            <div class="team-car">
                                <img
                                    :src="getTeamCarImage(item.Constructor.constructorId)"
                                    :alt="item.Constructor.Name"
                                    loading="lazy"
                                >
                            </div>
                            <div class="team-name text-white">{{ item.Constructor.Name }}</div>
                        </div>
                        <div class="drivers">
                            <div class="driver driver-left">Hammilton</div>
                            <div class="driver driver-right">Russel</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
const teamImages = import.meta.glob("/src/assets/images/teams/2023/*")
const teamCars = import.meta.glob("/src/assets/images/cars/2023/*")
import axios from 'axios';
import parser from 'xml2json-light'

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
            constructorsData: null,
            activeTeam: null,
            activeTeamName: null,
        };
    },
    mounted() {
        this.getConstuctorStandings();
        this.getDriverStandings();

        if (this.constructorsData) {
            this.setActiveTeam(
                this.constructorsData[0].Constructor.constructorId,
                this.constructorsData[0].Constructor.Name
            );
        }

        this.getTeamDrivers('mercedes');
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
        getConstuctorStandings() {
            let data = localStorage.getItem('constuctorStandings')
            const version = localStorage.getItem('constuctorStandingsVersion')

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
                axios.get('http://ergast.com/api/f1/current/constructorStandings')
                    .then(response => {
                        // handle success
                        console.log(response.data);
                        data = response.data;
                        localStorage.setItem('constuctorStandings', data)
                        localStorage.setItem('constuctorStandingsVersion', combinedDate)
                        this.constructorsData = this.parseXml(data);
                        // eslint-disable-next-line max-len
                        this.constructorsData = this.constructorsData.MRData.StandingsTable.StandingsList.ConstructorStanding;
                    })
                    .catch(error => {
                        // handle error
                        console.log(error);
                    });
            } else {
                this.constructorsData = this.parseXml(data);
                console.log(this.constructorsData);
                this.constructorsData = this.constructorsData.MRData.StandingsTable.StandingsList.ConstructorStanding;
                console.log(this.constructorsData);
            }
          
        },
        parseXml(xmlData) {
            return parser.xml2json(xmlData);
        },
        getTeamImage(teamName) {
            const teams = Object.keys(teamImages);
            const matchedTeam = teams.findIndex(element => element.includes(teamName))

            return teams[matchedTeam];
        },
        getTeamCarImage(teamName) {
            const teams = Object.keys(teamCars);
            const matchedTeam = teams.findIndex(element => element.includes(teamName))

            return teams[matchedTeam];
        },
        setActiveTeam(teamId, teamName) {
            this.activeTeam = teamId;
            this.activeTeamName = teamName;
        },
        getTeamDrivers(teamName) {
            const drivers = this.driversData;
            console.log(drivers);

            // for each item in array drivers
            // check if constructorId == teamName
            // if true, then get driverId and push to array named after constructorId
            // find array name with constructor id and return both 2 entries

            return drivers;
        },
        scrollToTop() {
            window.scrollTo(0,0);
        },
        toggleRoute() {
            this.$router.push({ path: '/teams' })
        },
    }
};
</script>