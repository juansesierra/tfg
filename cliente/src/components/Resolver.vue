<template>
    <div id=page-container>
        <div id="enunciado-container" class="partes-container cuadrados">
            <span>Enunciado</span><br>
            <span>Crea un programa que escriba por consola hola php!</span>
        </div>

        <div id="parte-derecha" class="partes-container">
            <div id="opciones-container"> 
                <div class="form-group col-md-10">
                    <select class="form-control col-md-4" id="lenguaje">
                        <option value="php"> PHP </option>
                    </select>
                </div>
                 <button id="btn-resolver" class="btn btn-primary"> Resolver </button>
            </div>
            <div id="solucion-container"> 
                <div class="form-group">
                    <textarea class="form-control" rows="16" id="comment" placeholder="Escribe aquí tu solución"></textarea>
                </div>

                <div id="respuesta-container" class="cuadrados">
                    <span id="enunciado-label">Salida</span>

                </div>

            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Resolver',
  data () {
    return {
        
    }
  },
  methods: {
      
  }
}
</script>

