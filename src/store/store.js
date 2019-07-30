import { getDataFromDB } from '../firebase/firebase.utils';

const Vue = require('vue/dist/vue.common');
const Vuex = require('vuex').default;

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
