import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showK8sImages: false,
  },
  mutations: {
    changeK8sImageShow (state) {
      state.showK8sImages = !state.showK8sImages
    }
  },
  actions: {

  }
})
