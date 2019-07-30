import Vue from 'vue'
import router from "./router.js"
import App from './App.vue'
import store from './store/store';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate,{
  classes: true,
  classNames: {
    invalid: 'is-invalid'
  }
});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
