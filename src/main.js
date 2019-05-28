import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import './stylus/main.styl'
import axios from 'axios'

var at = localStorage.getItem('access_token')

axios.defaults.headers.common = {
  ...axios.defaults.headers.common,
  // 'Access-Control-Allow-Origin': 'http://localhost:8080',
  "Content-Type": 'application/json',
  "Authorization": at ? `Bearer ${at}` : undefined,
};
// axios.defaults.preflightContinue = true;
// axios.defaults.crossDomain = true;
// axios.defaults.withCredentials = !!token;

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.mixin({
	computed: {
		api_url(){
	        return this.$store.state.remote_url + '/api/v1/'
	    },
	}
})

Vue.prototype.$eventHub = new Vue(); // Global event bus

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
  	this.$store.commit('SET_ACCESS_TOKEN', localStorage.getItem('access_token'))
  	this.$store.commit('SET_REMOTE_URL', process.env.VUE_APP_REMOTE_URL)
  	this.$store.commit('SET_API_KEY', process.env.VUE_APP_API_KEY)
  	this.$store.commit('SET_API_CLIENT_ID', process.env.VUE_APP_API_CLIENT_ID)
  },
  mounted(){
  }
}).$mount('#app')
