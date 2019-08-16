<template>
    <div>
        <navbar></navbar>
        <div class="usuarios-container">
            <div class="detalles-container">
                <img class ="fondo-detalles" src="../assets/jugadores.jpeg">
                <ul class="list-group list-group-flush">
                    <div class="list-group-item row fila" v-for="usuario in usuarios" :key="usuario.id">
                        <div class="col-sm-3">
                            <img :src="'data:image/jpeg;base64,' + usuario.foto" class="avatar">
                            <label>{{usuario.login}}</label>
                        </div>
                        <div class="col-sm-8 btn-container" v-if="resuelto">
                            <b-button @click="mostrarSolucion(usuario)" variant="primary"> Ver Solución </b-button>
                        </div>
                    </div>
                </ul>
            </div>
        </div>
        <b-modal ref="solucion" hide-footer :title="'Solución de ' + user">
            <textarea class="form-control" style="background:white" v-model="solucion" rows="16" id="codigo" disabled></textarea>
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
                user: '',
                resuelto: false
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


            var formData = new FormData();

            formData.append('usuario', localStorage.getItem('id_usuario'))
            formData.append('reto', this.$route.params.id)


            servicio_API.getUsuarioResuelto(formData).then(respuesta => {
                        
                if (respuesta.data) {
                    this.resuelto = respuesta.data;
                }
            
            }); 
        },
        
    }
</script>
