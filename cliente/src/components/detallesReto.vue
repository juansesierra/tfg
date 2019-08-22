<template>
    <div style="margin-bottom: 25%; height: 100%;">
        <navbar></navbar>
        <div class="mi-perfil">
            <div class="detalles-container">
                <img class ="fondo-detalles" src="../assets/programacion.jpg">

                <div class="card imagen-reto-container">
                    <img class="card-img-top card-image" :src="'data:image/jpeg;base64,' + foto" alt="Card image cap">
                    <div class="card-body">
                        <b-form-group id="input-group-4" label="Dificultad según creador:" label-for="input-4">
                            <p class="clasificacion">
                                <input id="radio1_fixed" type="radio" name="estrellas-fijas" value="5" disabled v-model="dificultad"><!--
                                --><label for="radio1_fixed" class="estrellas-fijas">★</label><!--
                                --><input id="radio2_fixed" type="radio" name="estrellas-fijas" value="4" disabled v-model="dificultad"><!--
                                --><label for="radio2_fixed" class="estrellas-fijas">★</label><!--
                                --><input id="radio3_fixed" type="radio" name="estrellas-fijas" value="3" disabled v-model="dificultad"><!--
                                --><label for="radio3_fixed" class="estrellas-fijas">★</label><!--
                                --><input id="radio4_fixed" type="radio" name="estrellas-fijas" value="2" disabled v-model="dificultad"><!--
                                --><label for="radio4_fixed" class="estrellas-fijas">★</label><!--
                                --><input id="radio5_fixed" type="radio" name="estrellas-fijas" value="1" disabled v-model="dificultad"><!--
                                --><label for="radio5_fixed" class="estrellas-fijas">★</label>
                            </p>
                        </b-form-group>
                        <b-form-group id="input-group-5" label="Dificultad según usuarios:" label-for="input-5">
                            <p class="clasificacion">
                                <input id="radio1" type="radio" name="estrellas" value="5" v-on:change="addDificultad" v-model="dificultad_usuario"><!--
                                --><label for="radio1" class="estrellas">★</label><!--
                                --><input id="radio2" type="radio" name="estrellas" value="4" v-on:change="addDificultad" v-model="dificultad_usuario"><!--
                                --><label for="radio2" class="estrellas">★</label><!--
                                --><input id="radio3" type="radio" name="estrellas" value="3" v-on:change="addDificultad" v-model="dificultad_usuario"><!--
                                --><label for="radio3" class="estrellas">★</label><!--
                                --><input id="radio4" type="radio" name="estrellas" value="2" v-on:change="addDificultad" v-model="dificultad_usuario"><!--
                                --><label for="radio4" class="estrellas">★</label><!--
                                --><input id="radio5" type="radio" name="estrellas" value="1" v-on:change="addDificultad" v-model="dificultad_usuario"><!--
                                --><label for="radio5" class="estrellas ">★</label>
                            </p>
                        </b-form-group>                      
                    </div>
                </div>
                <div class="contenido-detalles">
                    <div>
                        <h1 class="nombre-reto">{{nombre}} <button @click.prevent="irResolver"  class="btn btn-resolver btn-primary"> Resolver </button></h1>
                    </div>
                    <span>Enunciado:</span><br>
                    <span>{{this.descripcion}}</span><br><br>
                    <span>Usuarios que han resuelto el reto:</span><br>
                    <div id="usuarios_resueltos"> 
                        <img :src="'data:image/jpeg;base64,' + usuario.foto" class="avatar" v-for="usuario in usuarios" :key="usuario.id">
                        <a :href="'/listadoUsuariosReto/' + this.id">Ver más</a>
                    </div>
                    <div class="comentario_container">
                        <img :src="'data:image/jpeg;base64,' + foto_usuario" class="avatar">
                        <div class="texto">
                            <textarea rows="5" class="nuevo_comentario" v-model="nuevo_comentario" placeholder="Escribe algún comentario"></textarea>
                            <button @click.prevent="enviarComentario" class="btn btn-primary btn-derecha"> Enviar </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import {Servicio_API} from './../API.js'

import Navbar from './navbar.vue';
var servicio_API = new Servicio_API();


export default {
    components: {
            Navbar
        },
    name: 'Login',
    data () {
        return {
            id: '',
            foto: '',
            nombre: '',
            descripcion: '',
            dificultad: '',
            dificultad_usuario: '',
            usuarios: '',
            foto_usuario: '',
            nuevo_comentario: ''
        }
    },
    methods: {
        irResolver: function() {
            window.location.replace('/resolver/' + this.$route.params.id);
        },
        addDificultad: function () {
            var formData = new FormData();

            formData.append('reto', this.$route.params.id)
            formData.append('usuario', localStorage.getItem('id_usuario'))
            formData.append('valoracion', this.dificultad_usuario)


            servicio_API.addDificultad(formData).then(respuesta => {
                                    
                if (respuesta.data) {
                    console.log(respuesta.data)
                }
            
            });        
        },
        enviarComentario: function () {
            var formData = new FormData();

            formData.append('reto', this.$route.params.id)
            formData.append('usuario', localStorage.getItem('id_usuario'))
            formData.append('comentario', this.nuevo_comentario)

            servicio_API.enviarComentario(formData).then(respuesta => {
                                    
                if (respuesta.data) {
                    console.log(respuesta.data)
                    this.nuevo_comentario = '';
                }
            
            }); 
        }
    },
    created () {
        this.id = this.$route.params.id;
        this.foto_usuario = localStorage.getItem('foto_usuario');

        servicio_API.getReto(this.$route.params.id).then(respuesta => {
                        
            if (respuesta.data) {
                this.nombre = respuesta.data.nombre;
                this.descripcion = respuesta.data.descripcion;
                this.foto = respuesta.data.foto;
                this.dificultad = respuesta.data.dificultad;
                this.dificultad_usuario = respuesta.data.dificultad;
            }
           
        }); 

        servicio_API.getDificultad(this.$route.params.id).then(respuesta => {
                        
            if (respuesta.data) {
                this.dificultad_usuario = respuesta.data;
            }
           
        }); 

        servicio_API.getUsuariosReto(this.$route.params.id).then(respuesta => {
                        
            if (respuesta.data) {
                this.usuarios = respuesta.data;
            }
           
        }); 
    }
}
</script>