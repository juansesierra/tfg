<template>
    <div>
        <navbar></navbar>
        <div class="mi-perfil">
            <div class="detalles-container">
                <img class ="fondo-detalles" src="../assets/programacion.jpg">

                <div class="card imagen-reto-container">
                    <img class="card-img-top" :src="'data:image/jpeg;base64,' + foto" alt="Card image cap">
                    <div class="card-body">
                        <b-form-group id="input-group-4" label="Dificultad según creador:" label-for="input-4">
                            <p class="clasificacion">
                                <input id="radio1" type="radio" name="estrellas-fijas" value="5" disabled v-model="dificultad"><!--
                                --><label for="radio1" class="estrellas-fijas">★</label><!--
                                --><input id="radio2" type="radio" name="estrellas-fijas" value="4" disabled v-model="dificultad"><!--
                                --><label for="radio2" class="estrellas-fijas">★</label><!--
                                --><input id="radio3" type="radio" name="estrellas-fijas" value="3" disabled v-model="dificultad"><!--
                                --><label for="radio3" class="estrellas-fijas">★</label><!--
                                --><input id="radio4" type="radio" name="estrellas-fijas" value="2" disabled v-model="dificultad"><!--
                                --><label for="radio4" class="estrellas-fijas">★</label><!--
                                --><input id="radio5" type="radio" name="estrellas-fijas" value="1" disabled v-model="dificultad"><!--
                                --><label for="radio5" class="estrellas-fijas">★</label>
                            </p>
                        </b-form-group>
                        <b-form-group id="input-group-4" label="Dificultad según usuarios:" label-for="input-4">
                            <p class="clasificacion">
                                <input id="radio1" type="radio" name="estrellas" value="5" v-model="dificultad"><!--
                                --><label for="radio1" class="estrellas">★</label><!--
                                --><input id="radio2" type="radio" name="estrellas" value="4" v-model="dificultad"><!--
                                --><label for="radio2" class="estrellas">★</label><!--
                                --><input id="radio3" type="radio" name="estrellas" value="3" v-model="dificultad"><!--
                                --><label for="radio3" class="estrellas">★</label><!--
                                --><input id="radio4" type="radio" name="estrellas" value="2" v-model="dificultad"><!--
                                --><label for="radio4" class="estrellas">★</label><!--
                                --><input id="radio5" type="radio" name="estrellas" value="1" v-model="dificultad"><!--
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
                    <span>{{this.descripcion}}</span>
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
            foto: '',
            nombre: '',
            descripcion: '',
            dificultad: '',
        }
    },
    methods: {
        irResolver: function() {
            window.location.replace('/resolver/' + this.$route.params.id);
        }
    },
    created () {
         servicio_API.getReto(this.$route.params.id).then(respuesta => {
                        
            if (respuesta.data) {
                this.nombre = respuesta.data.nombre;
                this.descripcion = respuesta.data.descripcion;
                this.foto = respuesta.data.foto;
                this.dificultad = respuesta.data.dificultad;
            }
           
        }); 
    }
}
</script>