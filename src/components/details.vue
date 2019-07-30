<template>
    <div class="details">
        <h1 class="details__title">Details</h1>
        <div class="details__item">
            <p>Name:</p>
            <p>{{details.name}}</p>
        </div>

        <div class="details__item">
            <p>Location:</p>
            <p>{{details.location}}</p>
        </div>

        <div class="details__item">
            <p>Currency:</p>
            <p>{{details.currency}}</p>
        </div>

        <router-link to="/">← Back to table</router-link>
    </div>
</template>

<script>
    export default {
        name: 'details',
        props: ['id', 'details']
    }
</script>

<style scoped lang="stylus">
    .details {
        width 100%
        max-width 500px
        padding 40px 30px
        margin 50px auto 0 auto
        box-shadow 0 2px 19px 0 rgba(4, 10, 38, 0.2)
    }
    .details {
        &__title {
            margin-bottom 20px
        }
        &__item {
            display flex
            justify-content space-between
            margin-bottom 15px

            &:last-child {
                margin-bottom 0
            }
        }
    }
</style>
