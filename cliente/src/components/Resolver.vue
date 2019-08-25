<template>
    <div class="container">
        <div class="row">
        <div class="col-lg-6">
            <div id="enunciado-container" class="cuadrados">
                <span>Enunciado</span><br>
                <span class="comentario">{{this.descripcion}}</span>

                
            </div>
            <div id="salida-container" class="cuadrados salidas">
                    <span id="enunciado-label">Resultado de la ejecución</span>
                    <span id="salida" v-for="ejecucion in ejecuciones" :key="ejecucion.id"> 
                        <br><br> Test {{ejecucion.id}}
                        <br>Entrada: {{ejecucion.entrada}}
                        <br>Salida: {{ejecucion.salida}}
                    </span>
            </div>   
            
        </div>    

        <div  class="col-lg-6">
            <div id="opciones-container"> 
                <div class="form-group col-md-10">
                    <select class="form-control col-md-4" v-model="lenguaje" id="lenguaje">
                        <option value="php"> PHP </option>
                        <option value="py"> Python </option>
                        <option value="js"> NodeJS </option>

                    </select>
                </div>
                 <button id="btn-resolver" @click.prevent="enviarSolucion"  class="btn btn-primary"> Resolver </button>
            </div>
            <div id="solucion-container" > 
                <div class="form-group">
                    <textarea class="form-control" v-model="codigo" rows="16" id="codigo" placeholder="Escribe aquí tu solución"></textarea>
                </div>

                <div id="respuesta-container" class="cuadrados salidas">
                    <span id="enunciado-label">Respuesta<br><br></span>
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
        lenguaje: 'php',
        codigo: '',
        descripcion: '',
        entrada: '',
        salida_esperada: '',
        ejecuciones: [],
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

        var params = {
            reto:this.$route.params.id, 
            usuario:localStorage.getItem('id_usuario')
        };

        servicio_API.getRetoResuelto(params).then(respuesta => {
            if (respuesta.data) {
                this.codigo = respuesta.data.fichero;
            }            
        })
  },
  methods: {
       enviarSolucion: function () {
          
        var solucion = {
            lenguaje : this.lenguaje,
            codigo : this.codigo,
            idReto : this.$route.params.id,
            usuario : localStorage.getItem('usuario'),
            idUsuario: localStorage.getItem('id_usuario')
        }

        this.mostrar = false;
        this.color = 'black';
        this.salida_esperada = '';
        this.ejecuciones = [];
        document.getElementById('respuesta').innerHTML = '';

        this.$swal({
            type: 'info',
            title: 'Enviando',
            text: 'Esto puede tardar un momento, por favor no cierre ni recargue la página',
        })
        
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

            this.ejecuciones = respuesta.ejecuciones;
            var ultima = this.ejecuciones[this.ejecuciones.length-1];

            this.entrada = ultima.entrada;
            this.salida_esperada = ultima.salida_esperada;
        
        });                
          
      }
  }
}
</script>

