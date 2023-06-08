<template>
    <div id="driver">
        <div class="container">
            <div v-if="driverData" class="row">
                <div class="col-12 col-lg-6">
                    <div class="driver-card">
                        <div class="driver-img">
                            <img src="#" :alt="driverData.name">
                        </div>
                        <div class="driver-name">
                            <div class="driver-first-name">
                                <img src="#" :alt="driverData.country.name">
                                <span class="name">{{ driverData.country.name }}</span>
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
            <div v-else class="loader"></div>
        </div>
    </div>
</template>


<script>
import axios from 'axios';
import 'swiper/css';

export default {
    name: 'VueDriver',
    data() {
        return {
            expanded: false,
            driverData: null,
        };
    },
    mounted() {
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
        }
    }
};
</script>