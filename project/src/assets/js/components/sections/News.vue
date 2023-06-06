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
            <TransitionGroup name="list">
                <article v-for="article in newsData" v-show="!!article.image" :key="article.image" class="row article">
                    <div class="col-12 col-lg-3 img-wrap">
                        <div class="img-wrap">
                            <a :href="article.link" class="img-link" target="_blank">
                                <img
                                    :src="article.image"
                                    :alt="article.title"
                                    class="thumb-img"
                                    loading="lazy"
                                >
                            </a>
                        </div>
                    </div>
                    <div class="col-12 col-lg-9">
                        <a :href="article.link" target="_blank">
                            <div class="news-title" v-html="replaceChars(article.title)"/>
                            <div
                                class="news-description"
                                v-html="truncateCopy(replaceChars(article.description), $grid.lg ? 180 : 80)"
                            />
                        </a>
                    </div>
                </article>
            </TransitionGroup>
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
        };
    },
    watch: {
        newsData: function() {
            this.newsData.forEach((element, index) => this.populateArticleImg(element.link, index));
        }
    },
    beforeMount() {
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
                axios.get('https://www.formula1.com/content/fom-website/en/latest/all.xml')
                    
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
        populateArticleImg(url, index) {
            let img = null;
            const options = {
                url: url,
            };
            ogs(options)
                .then((data) => {
                    const {result} = data;
                    img = result.ogImage[0].url;
                    
                    const obj1 = this.newsData[index];
                    const obj2 = {...obj1, image: img};

                    return this.newsData[index] = obj2;
                });
        },
        formatDate(dateString) {
            const selectedDate = new Date(dateString);
            // eslint-disable-next-line max-len
            return selectedDate.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}
            )
        },
        truncateCopy(string, limit) {
            return string.substring(0, limit) + '...';
        }
    }
};
</script>