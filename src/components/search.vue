<template>
    <div>
        <input type="text" placeholder="Search" v-model="search" @input="input">
    </div>
</template>

<script>
    export default {
        name: 'search',
        data(){
            return{
                search: ''
            }
        },
        methods: {
            input(){
                this.$emit('input', this.search);
            }
        }
    }
</script>

<style scoped lang="stylus">
    input {
        border none
        outline none
        width 100%
        max-width 300px
        font-size 18px
        line-height 30px
        border-bottom 1px solid rgb(56,56,255)
        &:focus {
            border-bottom 1px solid rgb(26,26,230)
        }
    }
</style>
