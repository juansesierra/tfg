import Vue from 'vue'
import Router from 'vue-router'
import Resolver from '@/components/Resolver'
import addReto from '@/components/addReto'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Resolver',
      component: Resolver
    },
    {
      path: '/addReto',
      name: 'addReto',
      component: addReto
    }
  ]
})
