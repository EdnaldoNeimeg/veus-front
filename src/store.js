import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  	remote_url:'',
  	api_key:'',
  	client_id:'',
  	access_token:'',
  },
  mutations: {
  	SET_REMOTE_URL(state, url){
  		state.remote_url = url
  	},
  	SET_API_KEY(state, api_key){
  		state.api_key = api_key
  	},
  	SET_API_CLIENT_ID(state, client_id){
  		state.client_id = client_id
  	},
  	SET_ACCESS_TOKEN(state, token){
  		state.access_token = token
  	}
  },
  actions: {

  }
})
