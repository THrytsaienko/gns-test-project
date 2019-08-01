import { getDataFromDB } from '../firebase/firebase.utils';

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        tableData: []
    },
    mutations: {
        getDataFromDB(state, data){
            state.tableData = data;
        }
    },
    actions: {
        getDataFromDB({commit}, data){
            commit('getDataFromDB', data);
        }
    }
});

export default store;
