<template>
    <div>
        <navbar></navbar>
        <div id="addReto_container"> 
            <h1> Nuevo Reto </h1>
            <b-form @submit="onSubmit" @reset="onReset" v-if="show">
            <b-form-group id="input-group-1" label="Nombre:" label-for="input-1" >
                <b-form-input
                    id="input-1"
                    v-model="form.nombre"
                    required
                    placeholder="Introduce el nombre del reto"
                ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-2" label="Descripcion:" label-for="input-2">
                <b-form-textarea
                    id="input-2"
                    v-model="form.descripcion"
                    required
                    placeholder="Introduce la  descripcion del reto"
                    rows="3"
                    max-rows="6"
                ></b-form-textarea>
            </b-form-group>
            
            <b-form-group id="input-group-4" label="Dificultad:" label-for="input-4">
                <p class="clasificacion">
                    <input id="radio1" type="radio" name="estrellas" value="5" required v-model="form.dificultad"><!--
                    --><label for="radio1" class="estrellas">★</label><!--
                    --><input id="radio2" type="radio" name="estrellas" value="4" v-model="form.dificultad"><!--
                    --><label for="radio2" class="estrellas">★</label><!--
                    --><input id="radio3" type="radio" name="estrellas" value="3" v-model="form.dificultad"><!--
                    --><label for="radio3" class="estrellas">★</label><!--
                    --><input id="radio4" type="radio" name="estrellas" value="2" v-model="form.dificultad"><!--
                    --><label for="radio4" class="estrellas">★</label><!--
                    --><input id="radio5" type="radio" name="estrellas" value="1" v-model="form.dificultad"><!--
                    --><label for="radio5" class="estrellas">★</label>
                </p>
            </b-form-group>


            <div v-for="prueba in form.pruebas" :key="prueba.id">

                <b-form-group id="input-group-3" label="Fichero de entrada:" label-for="input-entrada">
                    <b-form-file
                        id="input-entrada"
                        v-model="prueba.f_entrada"
                        required
                        placeholder="Selecciona el fichero de entrada"
                    ></b-form-file>
                </b-form-group>

                <b-form-group id="input-group-3" label="Fichero de salida:" label-for="input-salida">
                    <b-form-file
                        id="input-salida"
                        v-model="prueba.f_salida"
                        required
                        placeholder="Selecciona el fichero de salida"
                    ></b-form-file>
                </b-form-group>
            </div>

            <b-button type="submit" variant="primary">Añadir</b-button>
            <b-button type="submit" @click.prevent="addPrueba" variant="info">Añadir entrada/salida</b-button>
            <b-button type="reset" variant="danger">Reiniciar</b-button>
            </b-form>
        </div>
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
                form: {
                nombre: '',
                descripcion: '',
                dificultad: null,
                pruebas: [{
                    id: 0,
                    f_entrada: null,
                    f_salida: null
                }]
                },
                show: true
            }
        },
        methods: {
        onSubmit(evt) {
            evt.preventDefault()

            var formData = new FormData();

            formData.append('nombre', this.form.nombre)
            formData.append('descripcion', this.form.descripcion)
            formData.append('dificultad', this.form.dificultad)

            formData.append('usuario', localStorage.getItem('id_usuario'))

            //formData.append('pruebas', this.form.pruebas)
            
            for (var i=0; i<this.form.pruebas.length; i++) {
                formData.append('entrada_'+i, this.form.pruebas[i].f_entrada);
                formData.append('salida_'+i, this.form.pruebas[i].f_salida)
            }

            servicio_API.addReto(formData).then(respuesta => {   
                // Reto insertado con exito             
                if (respuesta.data) {
                    this.$swal({
                        type: 'success',
                        title: respuesta.data,
                    })
                }
                // Ha habido algún error
                else {
                    this.$swal({
                        type: 'error',
                        title: respuesta.error,
                    })
                }
            }); 
        },
        onReset(evt) {
            evt.preventDefault()

            // Reset our form values
            this.form.nombre = ''
            this.form.descripcion = ''
            this.form.dificultad = null
            this.form.pruebas = [{
                id: 0,
                f_entrada: null,
                f_salida: null
            }]
            // Trick to reset/clear native browser form validation state
            this.show = false
            this.$nextTick(() => {
                this.show = true
            })
        },
        addPrueba : function () {
            var id = this.form.pruebas.length;

            this.form.pruebas.push({
                id: id,
                f_entrada: null,
                f_salida: null
            })
        }
        }
    }
</script>