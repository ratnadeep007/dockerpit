import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import SingleContainer  from './views/SingleContainer.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/containers',
      name: 'containers',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Container.vue')
    },
    {
      path: '/images',
      name: 'images',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Image.vue')
    },
    {
      path: '/container/:id',
      name: 'container',
      component: SingleContainer
    }
  ]
})
