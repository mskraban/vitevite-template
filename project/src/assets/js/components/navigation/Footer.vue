<template>
    <footer>
        <div class="container">
            <div class="row">
                <div class="col-12 col-lg-6">
                    <div class="logo">
                        <img
                            :src="images[1]"
                            alt="Next F1 Race" />
                        <div class="copy">
                            <div class="title">Next F1 Race</div>
                            <p class="mb-0">Ultimate F1 fan experience</p>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-lg-3">
                    <div class="category-title">
                        Page
                    </div>
                    <ul>
                        <li><a href="#">Lorem ipsum</a></li>
                        <li><a href="#">Lorem ipsum</a></li>
                        <li><a href="#">Lorem ipsum</a></li>
                        <li><a href="#">Lorem ipsum</a></li>
                    </ul>
                </div>
                <div class="col-12 col-lg-3">
                    <div class="category-title">
                        Page
                    </div>
                    <ul>
                        <li><a href="#">Lorem ipsum</a></li>
                        <li><a href="#">Lorem ipsum</a></li>
                        <li><a href="#">Lorem ipsum</a></li>
                        <li><a href="#">Lorem ipsum</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <section>
            © 2023 Next F1 Race
        </section>
    </footer>
</template>

<script>
import img01 from '../../../images/01_hero.jpg'
import img02 from '../../../images/flag_dark.svg'

export default {
    name: 'VueFooter',
    data() {
        return {
            images: [img01, img02],
            expanded: false,
        };
    },
};
</script>