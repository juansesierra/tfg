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

#app {
  height: 100%;
  width: 100%;
  margin-top: 3%; 
}

#enunciado-container {
  height: 79%;
  margin-bottom: 16px;
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

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
