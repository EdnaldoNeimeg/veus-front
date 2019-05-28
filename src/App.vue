<template>
  <v-app dark>
    <v-toolbar app color="primary">
      <v-img v-if="$store.state.access_token" src="http://site.veusserver.com/wp-content/themes/veus/img/logo.png" max-width="100"></v-img>
      <v-spacer></v-spacer>
      <v-btn
      v-if="$store.state.access_token"
        flat
        @click="logout"
      >
        Sair
      </v-btn>
    </v-toolbar>

    <v-content >
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      //
    }
  },
  methods: {
    logout(){
      this.$store.commit('SET_ACCESS_TOKEN','')
      localStorage.setItem('access_token','')
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="stylus">
</style>
