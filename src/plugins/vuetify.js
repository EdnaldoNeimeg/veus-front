import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import pt from 'vuetify/es5/locale/pt'

Vue.use(Vuetify, {
  theme: {
    primary: '#FEBA3C',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FEBA3C'
  },
  options: {
    customProperties: true
  },
  iconfont: 'md',
  lang: {
    locales: { pt },
    current: 'pt'
  },
})
