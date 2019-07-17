<template>
    <div class="container" id="app_container">
      <div class="container" id="login_container">
              <h2>Login</h2>
              <form>
                  <div class="form-group">
                      <label for="login">Nombre de usuario</label>
                      <input type="text" v-model="username" class="form-control" placeholder="Nombre de usuario" id="login">
                  </div>
                  <div class="form-group">
                      <label for="password">Contraseña</label>
                      <input type="password" v-model="password" class="form-control" placeholder="Contraseña" id="password">
                  </div>
                  <div>
                      <label>¿No tienes una cuenta? <router-link to="/registro" id="enlace_registro">Crear una</router-link></label>
                  </div>
                  <div class="clearfix"></div>
                  <button type="button" v-on:click="enviar" class="btn btn-primary btn-lg btn-responsive" id="boton_login"> <span class="glyphicon glyphicon-search"></span> Iniciar Sesión </button>
                  <div class="row mt-3 justify-content-center" id="error_login" v-if="mensaje_error != ''">
                      <div>
                          <div class="alert alert-danger alert-dismissible" role="alert" id="mensaje_login">
                              <button type="button" class="close" @click.prevent="cerrarMensaje" data-dismiss="alert" id="cerrar_mensaje_login" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                              {{mensaje_error}}
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
            username: '',
            password: '',
            mensaje_error: '' 
        }
    },

    methods: {
        enviar : function() {
            this.mensaje_error = '';

            var user = {
                "login" : this.username,
                "password" : this.password
            }

            servicio_API.loginUser(user).then (respuesta => {
                if (respuesta.data) {
                    localStorage.setItem('usuario', respuesta.data.login);
                    localStorage.setItem('id_usuario', respuesta.data.id);
                    localStorage.setItem('token', respuesta.token);

                    window.location.replace("/");
                }
                else {
                    this.mensaje_error = respuesta;
                }
            });
        },
        cerrarMensaje: function(evt) {
            evt.preventDefault()
            this.mensaje_error = '';
      }
    }
}
</script>
