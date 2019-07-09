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
            if (respuesta.ok) {
                return respuesta.json();
            }
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

}

