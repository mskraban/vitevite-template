<template>
    <div id="team">
        <div v-if="teamData && matchedTeam" class="container">
            <div class="row">
                <div class="col-12 col-lg-6">
                    <div
                        class="driver-card">
                        <div
                            class="driver-img team-gradient"
                            :class="matchedTeam.constructorId"
                        >
                            <img
                                :src="getTeamImage(matchedTeam.constructorId)"
                                :alt="matchedTeam.Name"
                                loading="lazy"
                            >
                        </div>
                        <div class="driver-name">
                            <div class="driver-first-name">
                                <span class="name">{{ matchedTeam.Name }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-lg-6">
                    <div class="driver-info-grid">
                        <div class="driver-info">
                            <div class="driver-info-row">
                                <div class="info-title">Full team name</div>
                                <div class="info-data">{{ teamData.name }}</div>
                            </div>
                            <div class="driver-info-row">
                                <div class="info-title">Team location</div>
                                <div class="info-data">{{ teamData.base }}</div>
                            </div>
                            <div class="driver-info-row">
                                <div class="info-title">First team entry</div>
                                <div class="info-data">{{ teamData.first_team_entry }}</div>
                            </div>
                            <div class="driver-info-row">
                                <div class="info-title">World chapionships</div>
                                <div class="info-data">{{ teamData.world_championships }}</div>
                            </div>
                            <div class="driver-info-row">
                                <div class="info-title">Pole positions</div>
                                <div class="info-data">{{ teamData.pole_positions }}</div>
                            </div>
                            <div class="driver-info-row">
                                <div class="info-title">Fastest laps</div>
                                <div class="info-data">{{ teamData.fastest_laps }}</div>
                            </div>
                            <div class="driver-info-row">
                                <div class="info-title">President</div>
                                <div class="info-data">{{ teamData.president }}</div>
                            </div>
                            <div class="driver-info-row">
                                <div class="info-title">Director</div>
                                <div class="info-data">{{ teamData.director }}</div>
                            </div>
                            <div class="driver-info-row">
                                <div class="info-title">Technical manager</div>
                                <div class="info-data">{{ teamData.technical_manager }}</div>
                            </div>
                            <div class="driver-info-row">
                                <div class="info-title">Chassis</div>
                                <div class="info-data">{{ teamData.chassis }}</div>
                            </div>
                            <div class="driver-info-row">
                                <div class="info-title">Engine</div>
                                <div class="info-data">{{ teamData.engine }}</div>
                            </div>
                            <div class="driver-info-row">
                                <div class="info-title">Tyres</div>
                                <div class="info-data">{{ teamData.tyres }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import 'swiper/css';
import parser from "xml2json-light";

export default {
    name: 'VueTeam',
    data() {
        return {
            expanded: false,
            teamData: null,
            teamCountry: null,
            constructorsData: null,
            matchedTeam: null,
        };
    },
    watch: {
        constructorsData: function() {
            this.getConstructorId();
        },
        teamData: function() {
            this.getConstructorId();
        }
    },
    mounted() {
        this.getConstuctorStandings();
        const name = window.location.pathname.split("/").pop();
        this.getTeamStanding(name.split("-")[0]);
    },
    methods: {
        getTeamStanding(name) {
            let data = localStorage.getItem('team' + name)
            const version = localStorage.getItem('teamVersion' + name)

            const date = new Date();
            const combinedDate =
                date.getHours() + '/' +
                date.getDay() + '/' +
                date.getMonth() + '/' +
                date.getFullYear();

            if (!version || version !== combinedDate) {
                axios.get('https://v1.formula-1.api-sports.io/teams?search=' + name, {
                    headers: {
                        "x-rapidapi-host": 'v1.formula-1.api-sports.io',
                        "x-rapidapi-key": '22d70395d894e3afd88a76045ff574b1'
                    }
                })
                    .then(response => {
                        // handle success
                        data = response.data.response[0];
                        localStorage.setItem('team' + name, JSON.stringify(data))
                        localStorage.setItem('teamVersion' + name, combinedDate)
                        this.teamData = data;
                    })
                    .catch(error => {
                        // handle error
                        console.log(error);
                    });
            } else {
                this.teamData = JSON.parse(data);
            }

        },
        scrollToTop() {
            window.scrollTo(0,0);
        },
        slugToString(slug) {
            return slug.split("-").slice(-1)[0];
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
            // trigger endpoint after first page load, set version
            // save date instead of version
            // refresh content every day - if there is 1 day diff

            if (!version || version !== combinedDate) {
                axios.get('https://ergast.com/api/f1/current/constructorStandings')
                    .then(response => {
                        // handle success
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
                this.constructorsData = this.constructorsData.MRData.StandingsTable.StandingsList.ConstructorStanding;
            }
        },
        parseXml(xmlData) {
            return parser.xml2json(xmlData);
        },
        getConstructorId() {
            this.constructorsData.forEach((team) => {
                console.table(team.Constructor.Name +' | '+ this.teamData.name)
                if (this.slugify(this.teamData.name).includes(this.slugify(team.Constructor.Name))) {
                    this.matchedTeam = team.Constructor;
                }
                // if (team.Constructor.Name == 'Alpine F1 Team') {
                //     this.matchedTeam = team.Constructor;
                //     console.log(team.Constructor);
                // }

                this.getCountryName(this.teamData.base);
            });
        },
        slugify(str) {
            str = str.replace(/^\s+|\s+$/g, '');
            str = str.toLowerCase();
            str = str.replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            return str;
        },
        getTeamImage(name) {
            return new URL(`/src/assets/images/teams/2023/${name}.svg`, import.meta.url).href
        },
        getCountryName(name) {
            let country = name;
            country = country.split(",")[1]

            return this.teamCountry = country;
        },
    }
};
</script>