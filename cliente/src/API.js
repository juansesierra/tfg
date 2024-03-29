export class Servicio_API { 
    
    // Ejecutar una solucion
    resolver(solucion) {
        var url = "http://localhost:3000/ejecutar";
        return fetch (url, {
            method: 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify(solucion)
        }). then (function (respuesta) {
                return respuesta.json();
        })
    }

    addReto(formData) {
        var url = "http://localhost:3000/retos";
        return fetch (url, {
            method: 'POST',
            body: formData
        }). then (function (respuesta) {
                return respuesta.json();
        })
    }

    editarReto(formData) {
        var url = "http://localhost:3000/retos";
        return fetch (url, {
            method: 'PUT',
            body: formData
        }). then (function (respuesta) {
                return respuesta.json();
        })
    }

    getRetos() {
        var url = "http://localhost:3000/retos";
        return fetch (url, {
            method: 'GET',
        }). then (function (respuesta) {
                return respuesta.json();
        })
    }

    getMisRetos(formData) {
        var url = "http://localhost:3000/misRetos";
        return fetch (url, {
            method: 'POST',
            body: formData
        }). then (function (respuesta) {
                return respuesta.json();
        })
    }

    getRetosResueltos(formData) {
        var url = "http://localhost:3000/retosResueltos";
        return fetch (url, {
            method: 'POST',
            body: formData
        }). then (function (respuesta) {
                return respuesta.json();
        })
    }

    getReto(id) {
        var url = "http://localhost:3000/retos/" + id;
        return fetch (url, {
            method: 'GET',
        }). then (function (respuesta) {
                return respuesta.json();
        })
    }

    getRetoResuelto(params) {
        var url = new URL("http://localhost:3000/retosResueltos");
        url.search = new URLSearchParams(params);

        
        return fetch (url, {
            method: 'GET',
        }). then (function (respuesta) {
                return respuesta.json();
        })
    }

    deleteSolucion(formData) {
        var url = "http://localhost:3000/solucion";
        return fetch (url, {
            method: 'DELETE',
            body: formData
        }). then (function (respuesta) {
                return respuesta.json();
        })
    }

    // Registrar un usuario
    addUser(user) {
        var url = "http://localhost:3000/users";
        return fetch (url, {
            method: 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify(user)
        }). then (function (respuesta) {
            if (respuesta.ok) {
                return '';
            }

            // Algo ha ido mal en la peticion
            else {
                if (respuesta.status === 403) {
                    return 'Ya existe el nombre de usuario, por favor prueba con otro';
                }

                else if (respuesta.status === 400) {
                    return 'Por favor rellena todos los campos';
                }

                else {
                    return 'Error en el servidor, por favor intentalo más tarde';
                }
            }
        })
    }

    loginUser(user) {
        var url = "http://localhost:3000/login";
        return fetch (url, {
            method: 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify(user)
        }). then (function (respuesta) {
            if (respuesta.ok) {
                return respuesta.json();
            }

            // Error al hacer login
            else {
                return 'Usuario o contraseña incorrectos';
            }
        
        })

    }

    getUser(id) {
        var url = "http://localhost:3000/users/" + id;
        return fetch (url, {
            method: 'GET',
        }). then (function (respuesta) {
                return respuesta.json();
        })
    }

    putUser(formData) {
        var url = "http://localhost:3000/users";
        return fetch (url, {
            method: 'PUT',
            body: formData
        }). then (function (respuesta) {
                return respuesta.json();
        })
    }

    addDificultad(formData) {
        var url = "http://localhost:3000/dificultad";
        return fetch (url, {
            method: 'POST',
            body: formData
        }). then (function (respuesta) {
                return respuesta.json();
        })
    }

    getDificultad(id) {
        var url = "http://localhost:3000/dificultad/" + id;
        return fetch (url, {
            method: 'GET'
        }). then (function (respuesta) {
                return respuesta.json();
        })
    }

    getUsuariosReto(id) {
        var url = "http://localhost:3000/usuariosReto/" + id;
        return fetch (url, {
            method: 'GET'
        }). then (function (respuesta) {
                return respuesta.json();
        })
    }

    getUsuarioResuelto(formData) {
        var url = "http://localhost:3000/usuariosReto";
        return fetch (url, {
            method: 'POST',
            body: formData
        }). then (function (respuesta) {
                return respuesta.json();
        })
    }

    getRanking() {
        var url = "http://localhost:3000/ranking";
        return fetch (url, {
            method: 'GET',
        }). then (function (respuesta) {
                return respuesta.json();
        })
    }

    enviarComentario(formData) {
        var url = "http://localhost:3000/comentarios";
        return fetch (url, {
            method: 'POST',
            body: formData
        }). then (function (respuesta) {
                return respuesta.json();
        })
    }

    getComentarios(id) {
        var url = "http://localhost:3000/comentarios/" + id;
        return fetch (url, {
            method: 'GET'
        }). then (function (respuesta) {
                return respuesta.json();
        })
    }
}

