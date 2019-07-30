<template>
    <router-view></router-view>
</template>

<script>
// import data from './data';
// import { loadDataToDB } from '../src/firebase/firebase.utils'

export default {
  name: 'App',
    // mounted() {
        // data.forEach(item => {
            // loadDataToDB(item);
        // })
    // }
};
</script>

<style lang="stylus">
    * {
        margin 0
        padding 0
    }
    body {
        box-sizing border-box
    }
</style>
