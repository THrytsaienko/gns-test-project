<template>
    <div class="message" :style="style">
        <p>{{text}}</p>
    </div>
</template>

<script>
    export default {
        name: 'message',
        props: ['text', 'color'],
        computed:{
            style(){
                return `background-color: ${this.color}`;
            }
        }
    }
</script>

<style scoped lang="stylus">
    .message {
        width 100%
        max-width 200px
        color #fff
        border-radius 2px
        padding 10px
        display flex
        justify-content center
        align-items center
        position fixed
        top 15%
        right 15%
        opacity 0
        text-align center

        animation:
                slideIn .5s ease-in-out .2s forwards,
                slideOut .4s ease-in-out 4s forwards
    }

    @keyframes slideIn {
        from {
            transform translateY(-100px)
            opacity 0
        }

        to {
            transform translateY(0)
            opacity 1
        }
    }

    @keyframes slideOut {
        from {
            transform translateX(0)
            opacity 1
        }

        to {
            transform translateX(50px)
            opacity 0
        }
    }
</style>
