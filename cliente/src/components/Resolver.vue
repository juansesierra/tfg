<template>
    <div id=page-container>
        <div id="enunciado-container" class="partes-container cuadrados">
            <span id="enunciado-label">Enunciado</span>
        </div>

        <div id="parte-derecha" class="partes-container">
            <div class="form-group">
                <textarea class="form-control" rows="16" id="comment" placeholder="Escribe aquí tu solución"></textarea>
            </div>

            <div id="respuesta-container" class="cuadrados">
                <span id="enunciado-label">Salida</span>

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

