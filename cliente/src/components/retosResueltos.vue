<template>
    <div>
        <navbar></navbar>
        <div v-for="reto in retos" :key="reto.id">
            <b-card :title="reto.nombre">

                <b-card-text>{{reto.descripcion}}</b-card-text>
                
                <a :href="'/resolver/' + reto.id" class="card-link">Resolver</a>
            </b-card>
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
