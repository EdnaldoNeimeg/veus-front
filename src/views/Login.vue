<script>
import axios from 'axios'

export default {
	data(){
		return {
			email:'',
			senha:'',
		}
	},
	methods: {
		login(){
			this.$http.post(this.$store.state.remote_url + '/oauth/token', {
				grant_type: 'password',
				client_secret: this.$store.state.api_key,
				client_id:this.$store.state.client_id,
				username:this.email,
				password: this.senha,
			}).then( r => {
				localStorage.setItem('access_token',r.data.access_token)
				this.$store.commit('SET_ACCESS_TOKEN', r.data.access_token)
				var th = this
				this.$http.defaults.headers.common.Authorization = `Bearer ${r.data.access_token}`
				this.$router.push('/')
				setTimeout( () => {
					th.$eventHub.$emit('logged-in');
				})
			})
		}
	}
}
</script>
<template>
	<v-dialog :value="true" persistent max-width="400px">
      <v-card color="primary">
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap justify-center mb-5>
              <v-flex>
              	<v-img class="ml-auto mr-auto" width="140" src="http://site.veusserver.com/wp-content/themes/veus/img/logo.png"></v-img>
              </v-flex>
            </v-layout>
            <v-layout wrap>
            	<v-divider></v-divider>
            	<v-flex xs12>
            		<v-text-field
            		  placeholder="Email"
            		  solo
            		  light
            		  v-model="email"
            		></v-text-field>
            	</v-flex>
            	<v-flex xs12>
            		<v-text-field
            			type="password"
            		  placeholder="Senha"
            		  solo
            		  light
            		  v-model="senha"
            		></v-text-field>
            	</v-flex>	
            </v-layout>
            <v-layout text-xs-center justify-center>
            	<v-flex>
			        <v-btn large :disabled="!email || !senha" color="grey darken-3" @click="login">Entrar</v-btn>
            	</v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>