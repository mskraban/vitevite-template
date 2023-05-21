<template>
    <div
        id="news"
        :class="embedView ? 'embed' : 'page-view'"
    >
        <span class="overlay">
            <router-link
                v-if="embedView"
                to="/news"
                @click="scrollToTop"
            >
                Latest news
            </router-link>
        </span>
        <div class="content">
            <div v-for="article in newsData" :key="article.link" class="news-item">
                <a :href="article.link" target="_blank" v-html="replaceChars(article.title)"></a>
            </div>
        </div>
    </div>
</template>


<script>
import axios from 'axios';
import parser from 'xml2json-light'

export default {
    name: 'VueNews',
    props: {
        embedView: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            newsData: null,
        };
    },
    mounted() {
        this.getNews();
    },
    methods: {
        getNews() {
            let data = localStorage.getItem('news')
            const version = localStorage.getItem('newsVersion')

            const date = new Date();
            const combinedDate =
                date.getHours() + '/' +
                date.getDay() + '/' +
                date.getMonth() + '/' +
                date.getFullYear();

            if (!version || version !== combinedDate) {
                axios.get('https://www.crash.net/rss/f1')
                    .then(response => {
                        // handle success
                        data = response.data;
                        localStorage.setItem('news', data)
                        localStorage.setItem('newsVersion', combinedDate)

                        this.newsData = this.parseXml(data);
                        this.newsData = this.newsData.rss.channel.item;
                    })
                    .catch(error => {
                        // handle error
                        console.log(error);
                    });
            } else {
                this.newsData = this.parseXml(data);
                this.newsData = this.newsData.rss.channel.item;
            }

        },
        parseXml(xmlData) {
            return parser.xml2json(xmlData);
        },
        replaceChars(string) {
            string = string.replace(/&lt;/g , "<");
            string = string.replace(/&gt;/g , ">");
            string = string.replace(/&quot;/g , "\"");
            string = string.replace(/&#39;/g , "'");
            string = string.replace(/&amp;/g , "&");
            return string;
        },
        scrollToTop() {
            window.scrollTo(0,0);
        },
    }
};
</script>