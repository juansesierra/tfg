<template>
    <div>
        <navbar></navbar>
        <div class="usuarios-container">
            <div>
                <div class="detalles-container">
                    <img class ="fondo-detalles" src="../assets/winners.jpg">
                    <h1 class="titulo">Ranking de usuarios</h1>
                </div>
                <ul class="list-group list-group-flush">
                     <div class="list-group-item row fila">
                        <div class="col-sm-3">
                            <label>Nombre de usuario</label>
                        </div>
                        <div class="col-sm-8 btn-container" >
                            <label>Puntuacion</label>                            
                        </div>
                    </div>
                    <div class="list-group-item row fila" v-for="usuario in usuarios" :key="usuario.id">
                        <div class="col-sm-3">
                            <img :src="'data:image/jpeg;base64,' + usuario.foto" class="avatar">
                            <label>{{usuario.login}}</label>
                        </div>
                        <div class="col-sm-8 btn-container" >
                            <label>{{usuario.puntuacion}} pts</label>                            
                        </div>
                    </div>
                </ul>
            </div>
        </div>
       
    </div>
</template>

<script>
    import {Servicio_API} from './../API.js';
    import Navbar from './navbar.vue';

    var servicio_API = new Servicio_API();

    export default {
        components: {
            Navbar
        },
        data() {
            return {
                usuarios: ''
            }
        },
        methods: {
            
        },
        created () {
            servicio_API.getRanking().then(respuesta => {
                        
                if (respuesta.data) {
                    this.usuarios = respuesta.data;
                }
            
            }); 
        },
        
    }
</script>
