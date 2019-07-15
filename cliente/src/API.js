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

    getRetos() {
        var url = "http://localhost:3000/retos";
        return fetch (url, {
            method: 'GET',
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

}

