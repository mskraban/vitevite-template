<template>
    <div>
        <h2>{{ heading }}</h2>
        <h3>Naslov H3</h3>
    </div>
</template>

<script>
export default {
    name: 'HeadingTitle',
    props: {
        heading: {
            type: String,
            default: 'Default',
        },
    },
};
</script>