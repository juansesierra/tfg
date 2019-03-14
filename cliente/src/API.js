export class Servicio_API { 
    
    // Registrar un usuario
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

            // Algo ha ido mal en la peticion
            else {
               
            }
        })
    }

    

}

