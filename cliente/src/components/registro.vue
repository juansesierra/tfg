<template>
    <div class="container" id="app_container">
      <div class="container" id="registro">
            <h2>Registro</h2>
            <form id="formRegistro">
                <div class="form-group">
                    <label for="login_registro">Nombre de usuario</label>
                    <input type="text" v-model="login" required class="form-control" placeholder="Nombre de usuario" id="login_registro">
                </div>
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
                <div>
                    <label>¿Ya tienes una cuenta? <router-link to="/login" id="enlace_login">Iniciar Sesión</router-link></label>
                </div>
                <div class="clearfix"></div>
                <button type="submit" @click.prevent="enviarRegistro" class="btn btn-primary btn-lg btn-responsive" id="boton_registro"> 
                    <span class="glyphicon glyphicon-search"></span> Registrame 
                </button>
                <div class="row mt-3 justify-content-center" id="error_registro" v-if="mensaje_error != ''">
                    <div> 
                        <div class="alert alert-danger alert-dismissible" role="alert">
                            <button type="button"  @click.prevent="cerrarMensaje" class="close" data-dismiss="alert" id="cerrar_mensaje_registro" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <span id="mensaje_registro">{{mensaje_error}} </span>
                        </div>
                    </div>
                </div>
            
            </form>
        </div>
      </div>
</template>

<script>
import {Servicio_API} from './../API.js'

var servicio_API = new Servicio_API();

export default {
  name: 'Login',
  data () {
    return {
        login: '',
        email: '',
        password: '',
        confirm: '',
        mensaje_error: ''
    }
  },
  methods: {
      enviarRegistro: function () {
          this.mensaje_error = '';
          if (this.password != this.confirm) {
             this.mensaje_error = "Las contraseñas no coinciden";
          }
          else {
                var user = {
                    login : this.login,
                    email : this.email,
                    password : this.password
                }
                servicio_API.addUser(user).then(respuesta => {
                    if (respuesta != ''){
                        this.mensaje_error = respuesta
                    }
                    else {
                        location.replace('/login');
                    }
                });                
          }
      },
      cerrarMensaje: function(evt) {
            evt.preventDefault()
            this.mensaje_error = '';
      }

  }
}
</script>