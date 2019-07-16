import Vue from 'vue'
import Router from 'vue-router'
import Resolver from '@/components/Resolver'
import addReto from '@/components/addReto'
import listadoRetos from '@/components/listadoRetos'
import registro from '@/components/registro'
import login from '@/components/login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'listadoRetos',
      component: listadoRetos
    },
    {
      path: '/registro',
      name: 'registro',
      component: registro
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/addReto',
      name: 'addReto',
      component: addReto
    },
    {
      path: '/resolver/:id',
      name: 'Resolver',
      component: Resolver
    },
  ]
})
