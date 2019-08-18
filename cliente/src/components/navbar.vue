<template>
    <nav class="navbar fixed-top navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="/">Inicio</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item active">
                    <a class="nav-link" href="/ranking">Ranking<span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item active">
                    <a class="nav-link" href="/misRetos">Mis retos <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item active">
                    <a class="nav-link" href="/retosResueltos">Retos resueltos</a>
                </li>
                <li class="nav-item active">
                    <a class="nav-link" href="/addReto">Nuevo reto</a>
                </li>
            </ul>
        </div>
        <div class="navbar-collapse collapse order-3 dual-collapse2">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Cuenta
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink" style="left:-69%">
                        <a class="dropdown-item" href="/miPerfil">Mi perfil</a>
                        <a class="dropdown-item" v-on:click="cerrarSesion">Cerrar sesión</a>
                    </div>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
export default {
    data () {
        return {
           
        }
    },
    methods: {
        cerrarSesion : function() {
            localStorage.removeItem("token");
            location.replace("/login");
        }
    }
  
}
</script>
