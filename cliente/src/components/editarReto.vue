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

            <label>Foto previa:</label>
            <div>
                <img :src="'data:image/jpeg;base64,' + foto_previa" id="foto_previa"/>
            </div>

            <b-form-group id="input-group" label="Foto del reto:" label-for="input-entrada">
                <b-form-file
                    id="input-entrada"
                    v-model="form.foto"
                    placeholder="Selecciona una foto para el reto"
                ></b-form-file>
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

            <div v-for="prueba in pruebas" :key="prueba.id"> 
                <nav class="navbar navbar-expand-lg navbar-dark bg-dark navbar-test">
                    <h1 class="navbar-brand titulo-test">Test {{prueba.numero}}</h1>
                    <div class="navbar-collapse collapse order-3 dual-collapse2">
                        <ul class="navbar-nav ml-auto">
                            <b-button type="submit" @click.prevent="deletePrueba(prueba)" variant="danger">Eliminar Test</b-button>
                        </ul>
                    </div>
                </nav>
                <b-form-group id="input-group-2" label="Entrada:" label-for="input-2">
                    <b-form-textarea
                        v-model="prueba.entrada"
                        disabled
                        rows="3"
                        max-rows="6"
                    ></b-form-textarea>
                </b-form-group>

                <b-form-group id="input-group-2" label="Salida:" label-for="input-2">
                    <b-form-textarea
                        v-model="prueba.salida"
                        disabled
                        rows="3"
                        max-rows="6"
                    ></b-form-textarea>
                </b-form-group>
            </div>

            <div v-for="prueba in form.pruebas_nuevas" :key="prueba.id">

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
            

            <b-button type="submit" variant="primary">Guardar</b-button>
            <b-button type="submit" @click.prevent="addPrueba" variant="info">Añadir entrada/salida</b-button>
            </b-form>
        </div>
    </div>

    
</template>


<script>
    import {Servicio_API} from './../API.js';
    import Navbar from './navbar.vue';

    window.App = { host: '{{ url("/") }}/' };
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
                    pruebas_nuevas: [],
                    foto:'',
                },
                foto_previa: '',
                pruebas: [],
                show: true
            }
        },
        created() {
            servicio_API.getReto(this.$route.params.id).then(respuesta => {
                            
                if (respuesta.data) {
                    this.form.nombre = respuesta.data.nombre;
                    this.form.descripcion = respuesta.data.descripcion;
                    this.form.dificultad = respuesta.data.dificultad;
                    this.pruebas = respuesta.data.soluciones;
                    this.foto_previa = respuesta.data.foto;
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
                formData.append('dificultad', this.form.dificultad)

                if (this.form.foto != '') {
                    formData.append('foto', this.form.foto)
                }   
                
                for (var i=0; i<this.form.pruebas_nuevas.length; i++) {
                    formData.append('entrada_'+i, this.form.pruebas_nuevas[i].f_entrada);
                    formData.append('salida_'+i, this.form.pruebas_nuevas[i].f_salida)
                }
                
                servicio_API.editarReto(formData).then(respuesta => {   
                    // Reto editado con exito             
                    if (respuesta.data) {
                        this.$swal({
                            type: 'success',
                            title: respuesta.data,
                        }).then(result => {
                            window.location.replace("/misRetos");
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
                var id = this.form.pruebas_nuevas.length;

                this.form.pruebas_nuevas.push({
                    id: id,
                    f_entrada: null,
                    f_salida: null
                })

            },
            deletePrueba: function (prueba) {
    
                this.$swal({
                    type: 'warning',
                    title: '¿Está seguro?',
                    text: "Una vez que se elimina el test, no se puede deshacer",
                    showCancelButton: true,
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                    cancelButtonColor: '#d33',
                }).then(result => {
                    if (result.value) {
                        var formData = new FormData();

                        formData.append('id', prueba.id)

                        servicio_API.deleteSolucion(formData).then(respuesta => {   
                            // Solucion eleminada con exito             
                            if (respuesta.data) {
                                this.$swal({
                                    type: 'success',
                                    title: respuesta.data,
                                }).then(result => {
                                    window.location.reload();
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
                    }
                })            
            }

        }
    }
</script>