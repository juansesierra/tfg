<template>
    <div>
        <navbar></navbar>
        <div class="container mi-perfil">
            <h1>Mi Perfil</h1>
            <form id="formRegistro">
                <div class="text-center">
                    <img :src="'data:image/jpeg;base64,' + foto" class="rounded foto-perfil">
                </div> 

                <b-form-group id="input-group" label="Foto de perfil:" label-for="input-entrada">
                    <b-form-file
                        id="input-entrada"
                        v-model="foto_nueva"
                        placeholder="Selecciona una nueva foto de perfil"
                    ></b-form-file>
                </b-form-group>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" v-model="email" required class="form-control" placeholder="Email" aria-describedby="emailHelp" id="email">
                </div>
                <div class="form-group">
                    <label for="password_registro">Contraseña</label>
                    <input type="password" v-model="password" required class="form-control" placeholder="Contraseña" id="password_registro">
                </div>
                <div class="form-group">
                    <label for="password_confirm">Repite contraseña</label>
                    <input type="password" v-model="confirm" required class="form-control" placeholder="Confirmar contraseña" id="password_confirm">
                </div> 
                <div class="clearfix"></div>
                <button type="submit" @click.prevent="editarUsuario" class="btn btn-primary btn-lg btn-responsive" id="boton_registro"> 
                    <span class="glyphicon glyphicon-search"></span> Guardar 
                </button>
            
            </form>
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
            email: '',
            password: '',
            confirm: '',
            foto: '',
            foto_nueva: ''
        }
    },
    methods: {
        editarUsuario: function () {
            this.mensaje_error = '';
            if (this.password != this.confirm) {
                this.$swal({
                    type: 'warning',
                    title: 'Las contraseñas no coinciden',
                })
            }
            else {

                var formData = new FormData();

                formData.append('login', localStorage.getItem('usuario'))
                formData.append('email', this.email)
                formData.append('password', this.password)

                if (this.foto_nueva != '') {
                    formData.append('foto', this.foto_nueva)
                }   

                servicio_API.putUser(formData).then(respuesta => {
                    if (respuesta.data){
                        this.$swal({
                            type: 'success',
                            title: 'Datos actualizados con éxito!',
                        }).then(result => {
                            window.location.reload();
                        })
                    }
                    else {
                        this.$swal({
                            type: 'warning',
                            title: 'No se han podido modificar los datos',
                        })
                    }
                });                
            }
        }
    },
    created () {
        let id = localStorage.getItem('id_usuario')
        servicio_API.getUser(id).then(respuesta => {
            if (respuesta.data) {
                this.email = respuesta.data.email;
                this.foto = respuesta.data.foto;
            }
            
        }); 
    }
}
</script>