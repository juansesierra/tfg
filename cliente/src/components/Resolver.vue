<template>
    <div class="container">
        <div class="row">
        <div class="col-lg-6">
            <div id="enunciado-container" class="cuadrados">
                <span>Enunciado</span><br>
                <span>{{this.descripcion}}</span>

                
            </div>
            <div id="salida-container" class="cuadrados salidas">
                    <span id="enunciado-label">Resultado de la ejecución</span>
                    <span id="salida"> 
                        <br><br>Entrada: {{this.entrada}}
                        <br>Salida: {{this.salida}}
                    </span>
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
                    <span id="enunciado-label">Respuesta<br></span>
                    <span id="respuesta" :style="'color:' + this.color"> 

                    </span>
                    <span v-show="this.mostrar"> 
                        <br>Entrada: {{this.entrada}}
                        <br>Salida esperada: {{this.salida_esperada}}
                    </span>
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
        descripcion: '',
        entrada: '',
        salida_esperada: '',
        salida: '',
        mostrar: false,
        color: 'black'
    }
  },
  created() {
        servicio_API.getReto(this.$route.params.id).then(respuesta => {
                        
            if (respuesta.data) {
                this.descripcion = respuesta.data.descripcion;
            }
           
        }); 
  },
  methods: {
       enviarSolucion: function () {
          
        var solucion = {
            lenguaje : this.lenguaje,
            codigo : this.codigo,
            idReto : this.$route.params.id,
            usuario : "juan"
        }

        this.mostrar = false;
        this.color = 'black';
        this.entrada =  this.salida = this.salida_esperada = '';
        document.getElementById('respuesta').innerHTML = '';

    
        
        servicio_API.resolver(solucion).then(respuesta => {
            console.log(respuesta);
            
            if (respuesta.data) {
                if (respuesta.data != "Ejecución correcta") {
                    this.salida_esperada = respuesta.salida_esperada;
                    this.mostrar = true;
                    this.color = 'red';
                }
                else {
                    this.color = 'green';
                }
                
                document.getElementById('respuesta').innerHTML = respuesta.data;
            }
            else {
                this.color = 'red';
                document.getElementById('respuesta').innerHTML = respuesta.error;
            }

            if (respuesta.entrada) {
                this.entrada = respuesta.entrada;
            }

            if (respuesta.salida) {
                this.salida = respuesta.salida;
            }
            
        });                
          
      }
  }
}
</script>

