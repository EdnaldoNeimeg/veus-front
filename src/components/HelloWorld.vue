<template>
  <v-container :class="{
        'pa-0':$vuetify.breakpoint.smAndDown
      }">
    <product v-if="$route.params.product_id"></product>
    <v-layout
      text-xs-center
      wrap
      row
      mb-4
    >
      <v-flex>
        <div class="pa-4 grey darken-4">
          <h3 :class="{
                'headline':$vuetify.breakpoint.mdAndUp,
                'caption':$vuetify.breakpoint.smAndDown,
              }">
            {{api_products_full_url}}
          </h3>
        </div>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex sm3 class="pa-4 grey darken-4 elevation-2">
        <div class="grey--text darken-5 mb-2 subheading" >Pesquisar:</div>
        <v-text-field @keyup="searchTimeOut()" v-model="query" solo></v-text-field>
        <div class="grey--text darken-2 mb-2 subheading">Marca:</div>
        <v-combobox solo
          v-if="brands.length && !loadingBrands"
          v-model="brand"
          :items="brands"
          item-value="id"
          item-text="name"
        >
        </v-combobox>
        <v-progress-linear v-else :indeterminate="true"></v-progress-linear>
        <v-checkbox
          dark
          class="mt-0 grey--text darken-4"
          v-model="quantity"
          color="primary"
          label="Não incluir produtos em falta"
        ></v-checkbox>
        <div class="grey--text darken-5 mb-2 subheading">Faixa de preço:</div>
        <b v-if="price && price[1] > 0">
          <span v-if="price[0] > 0">De {{'R$ ' + price[0].toFixed(2).replace('.',',')}} até</span>
          <span v-else>Até</span> {{'R$ ' + price[1].toFixed(2).replace('.',',')}}</b>
        <b v-else>Qualquer preço</b>
        <v-range-slider
          always-dirty
          dark
          v-model="price"
          thumb-label
          thumb-label-size="40"
          thumb-size="80"
          :max="300"
          :min="0"
          :step="2"
        >
        <template v-slot:thumb-label="props">
          <span class="title">
            <b>{{ label(props.value) }}</b>
          </span>
        </template>
      </v-range-slider>
      </v-flex>
      <v-flex sm9>
        <v-card color="grey darken-4" :class="{
        'ml-4':$vuetify.breakpoint.mdAndUp
      }">
          <v-card-text>
            <v-progress-linear v-if="loadingProducts" :indeterminate="true"></v-progress-linear>
            <template v-else>
              <table>
                <thead>
                  <tr class="primary--text">
                    <th
                      :class="{
                        'pa-2':$vuetify.breakpoint.mdAndUp,
                        'pa-1 caption':$vuetify.breakpoint.smAndDown,
                      }"
                      @click="sort='id',sort_order=!sort_order">ID</th>
                    <th
                      :class="{
                        'pa-2':$vuetify.breakpoint.mdAndUp,
                        'pa-1 caption':$vuetify.breakpoint.smAndDown,
                      }"
                      @click="sort='name',sort_order=!sort_order">Nome</th>
                    <th
                      :class="{
                        'pa-2':$vuetify.breakpoint.mdAndUp,
                        'pa-1 caption':$vuetify.breakpoint.smAndDown,
                      }"
                      @click="sort='price',sort_order=!sort_order">Preço</th>
                    <th
                      :class="{
                        'pa-2':$vuetify.breakpoint.mdAndUp,
                        'pa-1 caption':$vuetify.breakpoint.smAndDown,
                      }"
                      @click="sort='quantity',sort_order=!sort_order">Quantidade</th>
                    <th
                      :class="{
                        'pa-2':$vuetify.breakpoint.mdAndUp,
                        'pa-1 caption':$vuetify.breakpoint.smAndDown,
                      }"
                      @click="sort='brand.name',sort_order=!sort_order">Marca</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="products && products.data" v-for="product in products.data" :key="product.id">
                    <td :class="{
                      'pa-2':$vuetify.breakpoint.mdAndUp,
                      'pa-1 caption':$vuetify.breakpoint.smAndDown,
                    }">{{product.id}}</td>
                    <td :class="{
                      'pa-2':$vuetify.breakpoint.mdAndUp,
                      'pa-1 caption':$vuetify.breakpoint.smAndDown,
                    }">
                      <router-link :to="'/product/' + product.id">
                        {{product.name}}
                      </router-link>
                    </td>
                    <td :class="{
                      'pa-2':$vuetify.breakpoint.mdAndUp,
                      'pa-1 caption':$vuetify.breakpoint.smAndDown,
                    }">{{'R$ '+(product.price/100).toFixed(2).replace('.',',')}}</td>
                    <td :class="{
                      'pa-2':$vuetify.breakpoint.mdAndUp,
                      'pa-1 caption':$vuetify.breakpoint.smAndDown,
                    }">{{product.quantity}}</td>
                    <td :class="{
                      'pa-2':$vuetify.breakpoint.mdAndUp,
                      'pa-1 caption':$vuetify.breakpoint.smAndDown,
                    }">{{product.brand.name}}</td>
                  </tr>
                </tbody>
              </table>
              <v-layout wrap row justify-center text-xs-center>
                <v-flex>
                  <v-btn-toggle class="my-3" v-model="page">
                    <v-btn color="primary" v-for="p in products.last_page">{{p}}</v-btn>
                  </v-btn-toggle>
                </v-flex>
              </v-layout>
            </template>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import Product from './Product.vue'
  export default {
    components: {
      Product
    },
    data: () => ({
      page:0,
      timer:null,
      products:{},
      brands:[],
      brand:'',
      query:'',
      quantity:'',
      price: [0,0],
      sort:'',
      sort_order:true,
      loadingProducts: false,
      loadingBrands: false,
    }),
    beforeDestroy(){
      this.$eventHub.$off('logged-in')
    },
    mounted(){
      var th = this
      th.getBrands()
      th.makeRequest()
      this.$eventHub.$on('logged-in', function(){
        th.getBrands()
        th.makeRequest()
      })
    },
    watch:{
      'api_url':'apiUrlChanged',
      brand:function(){
        this.page = 0
        this.makeRequest()
      },
      quantity:'makeRequest',
      sort_order: function(){
        this.makeRequest()
        this.page = 0
      },
      brands:'brandsChanged',
      price:function(){
        this.page = 0
        this.priceChanged()
      },
      page:'makeRequest',
      '$store.state.access_token': function(){
        if(this.$store.state.access_token) {
          this.makeRequest()
        }
      }
    },
    computed: {
      api_products_full_url(){
        var url = this.api_url + 'products';
        url += this.query ? '?q='+this.query:''
        if(this.brand || this.quantity || (this.price && this.price[1] > 0)){
          url += (this.query ? '&':'?') + 'filter='

          if(this.brand){
            url += 'brand:' + this.brand.name + '|'
          }
          if(this.quantity){
            url += 'quantity:>0' + '|'
          }
          if(this.price && this.price[1] > 0){
            url += 'price:' + this.price[0] + ',' + this.price[1] +  '|'
          }

          url = url.slice(0, -1)
        }

        if(this.sort){
          url += (this.query || this.brand || this.quantity || (this.price && this.price[1] > 0) ? '&':'?') + 'sort='

          url += this.sort + ':' + (this.sort_order ? 'ASC':'DESC') + '|'

          url = url.slice(0, -1)
        }

        if(this.page){
          url += (this.query || this.brand || this.quantity || (this.price && this.price[1] > 0 || this.sort) ? '&':'?') + 'page=' + (this.page + 1)
        }

        return url
      },
    },
    methods: {
      priceChanged() {
        if(this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(() => {
          this.makeRequest()
        }, 1000);
      },
      searchTimeOut() { 
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(() => {
          this.makeRequest()
        }, 1100);
      },
      label(val) {
        return val + ',00';
      },
      apiUrlChanged(){
        this.getBrands()
      },
      getBrands(){
        this.loadingBrands = true;
        this.$http.get(this.api_url + 'brands').then( r => {
          this.brands = r.data
          this.loadingBrands = false;
        })
      },
      brandsChanged(){
        this.makeRequest()
      },
      makeRequest(){
        this.loadingProducts = true;
        this.$http.get(this.api_products_full_url).then( r => {
          // console.log(this.api_products_full_url)
          this.products = r.data
          this.loadingProducts = false;
        })
      }
    }
  }
</script>

<style lang="stylus">
a
  text-decoration none
.v-input
  .v-input__slot
    .v-text-field__slot
      input,
      label
        font-size 17px !important
table
  width 100%
  tbody,
  thead
    tr
      th
        cursor pointer
        &:hover
          background rgba(255,255,255,0.1)
    tr
      td,
      th
        text-align left
        border-bottom 1px solid rgba(#fff,0.2)
      &:hover
        td
          background rgba(#fff, 0.02)
</style>
