<template>
    <div>
        <b-card title="Card title">
            <b-card-text>
            Some quick example text to build on the <em>card title</em> and make up the bulk of the card's
            content.
            </b-card-text>

            <b-card-text>A second paragraph of text in the card.</b-card-text>

            <a href="#" class="card-link">Card link</a>
            <b-link href="#" class="card-link">Another link</b-link>
        </b-card>
    </div>
</template>

<script>
    import {Servicio_API} from './../API.js';

    var servicio_API = new Servicio_API();

    export default {
        data() {
            return {
                items: null
            }
        },
        created () {
            console.log("entro")
            servicio_API.getRetos().then(respuesta => {   
                console.log(respuesta)
                if (respuesta.data) {
                    this.items = respuesta.data;
                }
            })
        },
        
    }
</script>
