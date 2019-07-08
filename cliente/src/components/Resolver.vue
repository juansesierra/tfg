<template>
    <div class="container">
        <div class="row">
        <div class="col-lg-6">
            <div id="enunciado-container" class="cuadrados">
                <span>Enunciado</span><br>
                <span>Crea un programa que escriba por consola hola php!</span>

                
            </div>
            <div id="salida-container" class="cuadrados salidas">
                    <span id="enunciado-label">Salida del programa:</span>
                    <pre id="salida"> 
                        
                    </pre>
            </div>   
            
        </div>    

        <div  class="col-lg-6">
            <div id="opciones-container"> 
                <div class="form-group col-md-10">
                    <select class="form-control col-md-4" v-model="lenguaje" id="lenguaje">
                        <option value="php"> PHP </option>
                    </select>
                </div>
                 <button id="btn-resolver" @click.prevent="enviarSolucion"  class="btn btn-primary"> Resolver </button>
            </div>
            <div id="solucion-container" > 
                <div class="form-group">
                    <textarea class="form-control" v-model="codigo" rows="16" id="codigo" placeholder="Escribe aquí tu solución"></textarea>
                </div>

                <div id="respuesta-container" class="cuadrados salidas">
                    <span id="enunciado-label">Respuesta</span>
                    <pre id="respuesta"> 

                    </pre>
                </div>

            </div>
        </div>
        </div>
    </div>
</template>

<script>
import {Servicio_API} from './../API.js';

var servicio_API = new Servicio_API();

export default {
  name: 'Resolver',
  data () {
    return {
        lenguaje: '',
        codigo: '',
        
    }
  },
  methods: {
       enviarSolucion: function () {
          
        var solucion = {
            lenguaje : this.lenguaje,
            codigo : this.codigo
        }

        
        servicio_API.resolver(solucion).then(respuesta => {
            console.log(respuesta);
            
            document.getElementById('respuesta').innerHTML = respuesta.data;
            document.getElementById('salida').innerHTML = respuesta.salida;

            /*
            if (respuesta != ''){
                this.mensaje_error = respuesta
            }
            else {
                location.replace('/#/login');
            }*/
        });                
          
      }
  }
}
</script>

