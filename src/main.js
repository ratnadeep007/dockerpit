import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false
Vue.use(Vuetify, {
  iconfont: 'mdi'
})
Vue.filter('roundValuee', value => {
  let size = parseFloat(value)
  if (size < 1024) {
    return size.toFixed(2).toString() + ' MB'
  } else if (size >= 1024) {
    size = size / 1024
    return size.toFixed(2).toString() + ' GB'
  }
  // return parseFloat(value).toFixed(2)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
