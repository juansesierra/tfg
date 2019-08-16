<template>
    <div>
        <navbar></navbar>
        <div class="mi-perfil">
            <div class="detalles-container">
                <img class ="fondo-detalles" src="../assets/jugadores.jpeg">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item" v-for="usuario in usuarios" :key="usuario.id">
                        <img :src="'data:image/jpeg;base64,' + usuario.foto" class="avatar">
                        <span>{{usuario.login}}</span>
                        <b-button @click="mostrarSolucion(usuario)"  class="btn btn-resolver btn-primary"> Ver Solución </b-button>
                        
                    </li>
                </ul>
            </div>
        </div>
        <b-modal ref="solucion" hide-footer :title="'Solución de ' + user">
            <textarea class="form-control" v-model="solucion" rows="16" id="codigo" disabled></textarea>
        </b-modal>
    </div>
</template>

<script>
    import {Servicio_API} from './../API.js';
    import Navbar from './navbar.vue';

    var servicio_API = new Servicio_API();

    export default {
        components: {
            Navbar
        },
        data() {
            return {
                usuarios: '',
                solucion: '',
                user: ''
            }
        },
        methods: {
            mostrarSolucion: function(usuario) {
                this.solucion = usuario.fichero;
                this.user = usuario.login;

                this.$refs['solucion'].show();
            }
        },
        created () {
            servicio_API.getUsuariosReto(this.$route.params.id).then(respuesta => {
                        
                if (respuesta.data) {
                    this.usuarios = respuesta.data;
                }
            
            }); 
        },
        
    }
</script>
