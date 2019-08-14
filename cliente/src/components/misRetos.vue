<template>
    <div>
        <navbar></navbar>
        <div class="row mt-5 justify-content-center">
            <div class="card card-custom mx-2 mb-3" v-for="reto in retos" :key="reto.id">
                <img class="card-img-top card-image" :src="'data:image/jpeg;base64,' + reto.foto" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">{{reto.nombre}}</h5>
                    <a :href="'/editarReto/' + reto.id" class="card-link">Editar Reto</a>
                    <a :href="'/detallesReto/' + reto.id" class="card-link">Ver más</a>
                </div>
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
                retos: []
            }
        },
        created () {
            console.log("entro")
            var formData = new FormData();

            formData.append('usuario', localStorage.getItem('id_usuario'))

            servicio_API.getMisRetos(formData).then(respuesta => {   
                console.log(respuesta)
                if (respuesta.data) {
                    this.retos = respuesta.data;
                }
            })
        },
        
    }
</script>
