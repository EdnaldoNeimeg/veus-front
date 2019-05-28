<script>
import axios from 'axios'

export default {
	data(){
		return {
            product:{},
            qty:0
		}
	},
    mounted(){
        this.getProduct();
    },
    watch:{
        '$route.params.product_id': 'getProduct'
    },
	methods: {
		getProduct(){
            var url = this.api_url + 'product/' + this.$route.params.product_id
			
            this.$http.get( url ).then( r => {
                console.log(r.data)
                this.product = r.data
			})
		},
	}
}
</script>
<template>
	<v-dialog @input="v => v || $router.back()" :value="true" max-width="1200">
      <v-card color="primary">
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap row justify-center>
              <v-flex sm5>
              	<v-responsive class="align-center pa-5 text-xs-center" aspect-ratio="1" style="border: 2px solid #fff">
                   <v-icon size="300">image</v-icon> 
                </v-responsive>
              </v-flex>
              <v-flex sm7>
                <div class="px-3">
                    <v-layout row>
                        <v-flex>
                            <h1 class="display-1">
                                <b>{{product.name}}</b>
                            </h1>
                            <h2 class="mt-4 headline">Marca: <b v-if="product && product.brand">{{product.brand.name}}</b></h2>
                            <h2 class="mt-4 mb-4 headline"><b>{{product.quantity}} unidades em estoque</b></h2>
                        </v-flex> 
                    </v-layout>
                    <v-layout wrap row>
                        <v-flex sm6>
                            <v-layout wrap>
                                <v-flex xs4>
                                    <v-btn
                                        @click="qty = qty <= 1 ? 0 : qty - 1"
                                        flat
                                        color="white"
                                        light
                                        class="mx-0 display-1"
                                        style="padding: 15px; height: auto;">-</v-btn>
                                </v-flex>
                                <v-flex xs4>
                                    <input v-model="qty" type="text" style="height: 100%; min-width: 10px; width: 100%; color: #fff; font-size: 50px; font-weight: bold; text-align: center; outline: none;" />
                                </v-flex>
                                <v-flex xs4>
                                    <v-btn
                                        @click="qty = qty+1"
                                        flat
                                        color="white"
                                        light
                                        class="mx-0 display-1"
                                        style="padding: 15px; height: auto;">+</v-btn>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex sm6>
                            <v-btn class="mt-2 display-1" style="padding: 15px; height: auto;" color="green" depressed block large>COMPRAR</v-btn>
                        </v-flex>
                    </v-layout>
                </div>    
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>