<template>
    <div
        id="news"
        :class="embedView ? 'embed' : 'page-view'"
    >
        <div v-if="embedView" class="embed-wrap">
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
        <div v-else class="container">
            <div class="row">
                <div class="col-12">
                    <div class="content">
                        <h1>News</h1>
                        <p>F1 news.</p>
                    </div>
                </div>
            </div>
            <article v-for="(article, index) in newsData" :key="article.link" class="row article">
                <div class="col-12 col-lg-3 img-wrap">
                    <div class="img-wrap">
                        <img :src="newsImages[index]" :alt="article.title" class="thumb-img" loading="lazy">
                    </div>
                </div>
                <div class="col-12 col-lg-9">
                    <a :href="article.link" target="_blank">
                        <div class="news-published">{{ article.pubDate }}</div>
                        <div class="news-title" v-html="replaceChars(article.title)"/>
                        <div class="news-description" v-html="replaceChars(article.description)"/>
                    </a>
                </div>
            </article>
        </div>
    </div>
</template>


<script>
import axios from 'axios';
import parser from 'xml2json-light'
import ogs from 'open-graph-scraper'

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
            newsImages: [],
        };
    },
    mounted() {
        this.getNews();
        this.newsData.forEach(element => this.getArticleImage(element.link));
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
        getArticleImage(url) {
            let img = null;
            const options = {
                url: url,
            };
            ogs(options)
                .then((data) => {
                    const {result} = data;
                    img = result.ogImage[0].url;
                    this.newsImages.push(img);

                });
            return img;
        }
    }
};
</script>