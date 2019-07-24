<template>
    <div>
        <navbar></navbar>
        <div id="addReto_container"> 
            <h1> Editar Reto </h1>
            <b-form @submit="onSubmit" v-if="show">
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

            

            <b-button type="submit" variant="primary">Guardar</b-button>
            <b-button type="submit" @click.prevent="addPrueba" variant="info">Añadir entrada/salida</b-button>
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
                pruebas: [{
                    id: 0,
                    f_entrada: null,
                    f_salida: null
                }]
                },
                show: true
            }
        },
        created() {
            servicio_API.getReto(this.$route.params.id).then(respuesta => {
                            
                if (respuesta.data) {
                    this.form.nombre = respuesta.data.nombre;
                    this.form.descripcion = respuesta.data.descripcion;
                }
            
            }); 
        },
        methods: {
        onSubmit(evt) {
            evt.preventDefault()

            var formData = new FormData();

            formData.append('id', this.$route.params.id)
            formData.append('nombre', this.form.nombre)
            formData.append('descripcion', this.form.descripcion)
            
            /*
            for (var i=0; i<this.form.pruebas.length; i++) {
                formData.append('entrada_'+i, this.form.pruebas[i].f_entrada);
                formData.append('salida_'+i, this.form.pruebas[i].f_salida)
            }
            */
            servicio_API.editarReto(formData).then(respuesta => {   
                // Reto editado con exito             
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