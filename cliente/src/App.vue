<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html, body{
    height: 100%;
    width: 100%;
    margin: 0;
    background: none;
    position: absolute;
}

#app, #page-container {
  height: 100%;
  width: 100%;
}

#page-container {
  display: flex;
  margin-top: 2%;
  margin-left: 5%;
}

.partes-container {
  width: 40%;
  height: 90%;
}

#parte-derecha {
  margin-left: 20px;
}

#opciones-container {
  display: -webkit-box;
}

.col-md-10 {
  padding: 0;
}

#solucion-container {
  height: 74%;
}

#btn-resolver {
  position: relative;
  left: 10%;
}

.cuadrados {
  border: 1px solid #ced4da;
  text-align: left;
  padding-left: 10px;
}

#respuesta-container {
  height: 34%
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
