<template>
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

        <b-form-group id="input-group-3" label="Fichero de entrada:" label-for="input-entrada">
            <b-form-file
                id="input-entrada"
                v-model="form.f_entrada"
                required
                placeholder="Selecciona el fichero de entrada"
            ></b-form-file>
        </b-form-group>

        <b-form-group id="input-group-3" label="Fichero de salida:" label-for="input-salida">
            <b-form-file
                id="input-salida"
                v-model="form.f_salida"
                required
                placeholder="Selecciona el fichero de salida"
            ></b-form-file>
        </b-form-group>

        <b-button type="submit" variant="primary">Añadir</b-button>
        <b-button type="reset" variant="danger">Reiniciar</b-button>
        </b-form>
    </div>
    
</template>


<script>
    import {Servicio_API} from './../API.js';

    var servicio_API = new Servicio_API();

    export default {
        data() {
        return {
            form: {
            nombre: '',
            descripcion: '',
            f_entrada: null,
            f_salida: null
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
            formData.append('entrada', this.form.f_entrada)
            formData.append('salida', this.form.f_salida)

            servicio_API.addReto(formData).then(respuesta => {
                console.log(respuesta);
            
           
            }); 
        },
        onReset(evt) {
            evt.preventDefault()
            // Reset our form values
            this.form.nombre = ''
            this.form.descripcion = ''
            this.form.f_entrada = null
            this.form.f_salida = null
            // Trick to reset/clear native browser form validation state
            this.show = false
            this.$nextTick(() => {
            this.show = true
            })
        }
        }
    }
</script>