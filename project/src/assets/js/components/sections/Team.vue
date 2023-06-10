<template>
    <div id="driver">
        <div v-if="teamData" class="container">
            <div class="row">
                Team page
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
            constructorsData: null,
            matchedTeam: null,
        };
    },
    watch: {
        constructorsData: function() {
            this.getConstructorId();
        }
    },
    mounted() {
        this.getConstuctorStandings();
        const name = window.location.pathname.split("/").pop();
        this.getTeamStanding(this.slugToString(name));
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
                    console.log(team.Constructor)
                }
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
            return new URL(`/src/assets/images/teams/2023/${name}.webp`, import.meta.url).href
        },
        getCountryFlag(name) {
            return new URL(`/src/assets/images/countries/flags/${name}.svg`, import.meta.url).href
        },
    }
};
</script>