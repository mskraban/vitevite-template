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
        <div class="row">

            <div class="col-12 col-lg-6">
                <div class="teams">
                    <div
                        v-for="item in constructorsData" :key="item"
                        class="team team-color mercedes"
                        :class="item.Constructor.constructorId"
                        @mouseover="setActiveTeam(item.Constructor.constructorId, item.Constructor.Name)"
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
                                to="/standings"
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
    </div>
</template>


<script>
const teamImages = import.meta.glob("/src/assets/images/teams/2023/*")
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
            constructorsData: null,
            activeTeam: null,
            activeTeamName: null,
        };
    },
    mounted() {
        this.getConstuctorStandings();

        if (this.constructorsData) {
            this.setActiveTeam(
                this.constructorsData[0].Constructor.constructorId,
                this.constructorsData[0].Constructor.Name
            );
        }
    },
    methods: {
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
        setActiveTeam(teamId, teamName) {
            this.activeTeam = teamId;
            this.activeTeamName = teamName;
        },
        scrollToTop() {
            window.scrollTo(0,0);
        },
    }
};
</script>