<template>
    <div id="driver">
        <div v-if="driverData" class="container">
            <div class="row">
                <div class="col-12 col-lg-6">
                    <div
                        class="driver-card">
                        <div
                            class="driver-img team-gradient"
                            :class="constructorId"
                        >
                            <img
                                :src="getDriverImage(driverId)"
                                :alt="driverData.name"
                                loading="lazy"
                            >
                        </div>
                        <div class="driver-name">
                            <div class="driver-first-name">
                                <img
                                    :src="getCountryFlag(slugify(driverData.country.code))"
                                    class="country-flag"
                                    :alt="driverData.country.name"
                                >
                                <span class="name">{{ firstName }}</span>
                            </div>
                            <div class="driver-last-name">
                                {{ lastName }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-lg-6">
                    <div class="driver-info-grid">
                        <div class="driver-info">
                            <div class="driver-info-row">
                                <div class="info-title">Country</div>
                                <div class="info-data">{{ driverData.country.name }}</div>
                            </div>
                        </div>
                        <div class="driver-info">
                            <div class="driver-info-row">
                                <div class="info-title">Birthdate</div>
                                <div class="info-data">{{ driverData.birthdate }}</div>
                            </div>
                        </div>
                        <div class="driver-info">
                            <div class="driver-info-row">
                                <div class="info-title">Age</div>
                                <div class="info-data">{{ getAge(driverData.birthdate) }}</div>
                            </div>
                        </div>
                        <div class="driver-info">
                            <div class="driver-info-row">
                                <div class="info-title">Birthplace</div>
                                <div class="info-data">{{ driverData.birthplace }}</div>
                            </div>
                        </div>
                        <div class="driver-info">
                            <div class="driver-info-row">
                                <div class="info-title">Driver number</div>
                                <div class="info-data">{{ driverData.number }}</div>
                            </div>
                        </div>
                        <div class="driver-info">
                            <div class="driver-info-row">
                                <div class="info-title">Grand prixs entered</div>
                                <div class="info-data">{{ driverData.grands_prix_entered }}</div>
                            </div>
                        </div>
                        <div class="driver-info">
                            <div class="driver-info-row">
                                <div class="info-title">World Championships</div>
                                <div class="info-data">{{ driverData.world_championships }}</div>
                            </div>
                        </div>
                        <div class="driver-info">
                            <div class="driver-info-row">
                                <div class="info-title">Podiums</div>
                                <div class="info-data">{{ driverData.podiums }}</div>
                            </div>
                        </div>
                        <div class="driver-info">
                            <div class="driver-info-row">
                                <div class="info-title">Highest race finish</div>
                                <div class="info-data">{{ driverData.highest_race_finish.position }}</div>
                            </div>
                        </div>
                        <div class="driver-info">
                            <div class="driver-info-row">
                                <div class="info-title">Highest race start position</div>
                                <div class="info-data">{{ driverData.highest_grid_position }}</div>
                            </div>
                        </div><div class="driver-info">
                            <div class="driver-info-row">
                                <div class="info-title">Career points</div>
                                <div class="info-data">{{ driverData.career_points }}</div>
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
    name: 'VueDriver',
    data() {
        return {
            expanded: false,
            driverData: null,
            driverId: null,
            driversData: null,
            constructorId: null,
            firstName: null,
            lastName: null,
        };
    },
    watch: {
        driverData: function() {
            this.getDriverId();
        }
    },
    mounted() {
        this.getDriverStandings();
        const name = window.location.pathname.split("/").pop();
        this.getDriverStanding(this.slugToString(name));
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
                        data = response.data.response[0];
                        localStorage.setItem('driver' + name, JSON.stringify(data))
                        localStorage.setItem('driverVersion' + name, combinedDate)
                        this.driverData = data;
                    })
                    .catch(error => {
                        // handle error
                        console.log(error);
                    });
            } else {
                this.driverData = JSON.parse(data);
            }
          
        },
        scrollToTop() {
            window.scrollTo(0,0);
        },
        slugToString(slug) {
            return slug.split("-").slice(-1)[0];
        },
        getAge(dateString) {
            const today = new Date();
            const birthDate = new Date(dateString);

            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            return age;
        },
        getDriverStandings() {
            let data = localStorage.getItem('driverStandings')
            const version = localStorage.getItem('driverStandingsVersion')

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
                axios.get('https://ergast.com/api/f1/current/driverStandings')
                    .then(response => {
                        // handle success
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
        parseXml(xmlData) {
            return parser.xml2json(xmlData);
        },
        getDriverId() {
            let driverId = null;
            let constructorId = null;
            let firstName = null;
            let lastName = null;
            
            this.driversData.forEach((driver) => {
                if (driver.Driver.PermanentNumber == 33) {
                    driver.Driver.PermanentNumber = 1;
                }

                if (this.driverData.number == driver.Driver.PermanentNumber) {
                    driverId = driver.Driver.driverId;
                    constructorId = driver.Constructor.constructorId;
                    firstName = driver.Driver.GivenName;
                    lastName = driver.Driver.FamilyName;
                }
            });
            
            this.driverId = driverId;
            this.constructorId = constructorId;
            this.firstName = firstName;
            this.lastName = lastName;
        },
        slugify(str) {
            str = str.replace(/^\s+|\s+$/g, '');
            str = str.toLowerCase();
            str = str.replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            return str;
        },
        getDriverImage(name) {
            return new URL(`/src/assets/images/drivers/2023/${name}.webp`, import.meta.url).href
        },
        getCountryFlag(name) {
            return new URL(`/src/assets/images/countries/flags/${name}.svg`, import.meta.url).href
        },
    }
};
</script>