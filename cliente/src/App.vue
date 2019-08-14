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
}

#enunciado-container {
  height: 79%;
  max-height: 450px !important;
  margin-bottom: 16px;
}

.container {
  margin-top: 3%; 
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

#respuesta-container {
  height: 35% !important;
  overflow: auto;
}

#salida-container {
  height: 26% !important;
  overflow: auto;
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

#codigo {
  font-family: Courier;
}

/*  Añadir retos  */

#addReto_container {
  padding: 5% 20%;
}

input[type="radio"] {
  display: none;
}

.estrellas, .estrellas-fijas {
  color: grey;
  font-size: 1.5rem;
}

.clasificacion {
  direction: rtl;
  unicode-bidi: bidi-override;
}

.estrellas:hover,
.estrellas:hover ~ label {
  color: orange;
}

input[type="radio"]:checked ~ label {
  color: orange;
}

/* Editar retos */

.titulo-test {
  font-size: 1.5rem;
}

.navbar-test {
  margin-bottom: 10px;
}

#foto_previa {
  max-height: 350px;
  margin-bottom: 15px;
}

/* Listado de retos */
.card-custom {
    max-width: 300px;
}

.card-image {
  height: 300px;
}

.mt-5 {
  margin-top: 6rem !important;
}

/* Foto de perfil de usuarios */

.mi-perfil {
  margin-top: 6%;
  padding: 0 10%;
}

.foto-perfil {
  max-height: 300px;
  margin-bottom: 20px;
}

/* Detalles Reto */
.imagen-reto-container {
  position: absolute;
  top: 25%;
  left: 2%;
  width: 18rem;
}

.detalles-container {
  position: relative;
}

.fondo-detalles {
  width: 100%;
  height: 400px;
}

.nombre-reto {
  font-size: 90px;
  line-height: 125px;

}

.contenido-detalles {
  position: absolute;
  width: 70%;
  left: 28%;
  text-align: left;
}

.btn-resolver {
  float: right;
  margin-top: 5%;
}

</style>
