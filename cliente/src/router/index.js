import Vue from 'vue'
import Router from 'vue-router'
import Resolver from '@/components/Resolver'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Resolver',
      component: Resolver
    }
  ]
})
