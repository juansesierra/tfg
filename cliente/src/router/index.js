import Vue from 'vue'
import Router from 'vue-router'
import Resolver from '@/components/Resolver'
import addReto from '@/components/addReto'
import listadoRetos from '@/components/listadoRetos'
import registro from '@/components/registro'
import login from '@/components/login'
import editarReto from '@/components/editarReto'
import misRetos from '@/components/misRetos'
import retosResueltos from '@/components/retosResueltos'




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
      component: addReto,
      beforeEnter: (to, from, next) => { 
        if (!localStorage.token) {
          next('login');
        }
        else {
          next();  
        }
      } 
    },
    {
      path: '/misRetos',
      name: 'misRetos',
      component: misRetos,
      beforeEnter: (to, from, next) => { 
        if (!localStorage.token) {
          next('login');
        }
        else {
          next();  
        }
      } 
    },
    {
      path: '/retosResueltos',
      name: 'retosResueltos',
      component: retosResueltos,
      beforeEnter: (to, from, next) => { 
        if (!localStorage.token) {
          next('login');
        }
        else {
          next();  
        }
      } 
    },
    {
      path: '/resolver/:id',
      name: 'Resolver',
      component: Resolver,
      beforeEnter: (to, from, next) => { 
        if (!localStorage.token) {
          next('login');
        }
        else {
          next();  
        }
      } 
    },
    {
      path: '/editarReto/:id',
      name: 'editarReto',
      component: editarReto,
      beforeEnter: (to, from, next) => { 
        if (!localStorage.token) {
          next('login');
        }
        else {
          next();  
        }
      } 
    },
  ]
})
