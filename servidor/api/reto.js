if(!app)
    throw new Error('Express no existe en este contexto. RuntimeException.')

//"capa" web (no aparecen referencias al API de Knex)
app.get("/retos/:id", function(pet, resp){
    let idReto = parseInt (pet.params.id);
    
    obtenerReto(idReto)
    .then(datos => {
        
        resp.send(datos);
        
    })
    .catch(error => {
        resp.status(error.err);
        resp.end();
    })

})

function obtenerReto(id) {
    
    return new Promise((resolve, reject)=>{
        knex.select().from('reto').where("id",id)
        .then(function(datos){
            if(datos.length<1) {
                reject({err:404});
            }

            else {
                resolve({data:datos[0]})
            }
        })
    })
}  

// listado con todos las retos
app.get("/retos", function(pet, resp){
    var respuesta = {
        data : 0
    }

    listarRetos().then(datos => {
        if (datos.err) {
            resp.status(datos.err);
            resp.end();
        }
        else {
            respuesta.data = datos.data;
            resp.send(respuesta);
        }
    })

})
 
function listarRetos() {
    
    return new Promise((resolve, reject)=>{
        knex.select().from('reto').then(datos => {
            resolve({
                data: datos
            })
        })
    })
}

function findByNombre(nombre) {

    return new Promise((resolve, reject)=>{
        if (nombre) {
            knex.select().from('reto').where("nombre", nombre)
            .then(function(datos){
                if (datos.length<1) {
                    reject({err:404});
                }
                else {
                    resolve({data:datos[0]});
                }

            })
        }
        else {
            reject({err:404});
        }
    });

}

app.post('/retos', function (req, resp) {
    let nuevo = req.body;
    var responseObj = {};
    var reto;

    if (req.files) {
        
    }
    
    try {

        addReto(nuevo)
        .then( response => {
            reto = response;
            return subirArchivos(req, resp);
        })
        .then (solucion => {
            console.log(solucion);
            return addSolucion(reto.data, solucion)
        })
        .then (response => {
            resp.status(201); // reto insertado               
            responseObj.data = "Reto insertado con éxito!";
            resp.send(responseObj)
        })
        .catch(error => {
            if (error.err) {
                resp.status(error.err)
            }
            else {
                resp.status(500)
            }
            
            resp.send({error: error.message})
        })

    } catch(err) {
        resp.status(500)
		resp.send({error:err.message})
    }
})

function subirArchivos (req, resp) {
    var solucion = {};

    return new Promise((resolve, reject)=>{
        //console.log(req);
        exec ("mkdir ./retos/" + req.body.nombre, function (error) {
            if (error == null) {
                solucion.entrada = "./retos/" + req.body.nombre + "/" + req.files.entrada.name;
                solucion.salida = "./retos/" + req.body.nombre + "/" + req.files.salida.name;
        
                let File = req.files.entrada;
        
                // Subimos la entrada al servidor
                File.mv(solucion.entrada).then( function () {

                    return File.mv(solucion.salida);

                }).then(function () {
                
                    resolve(solucion);

                }).catch(function (err){
                    resp.status(500)
                    resp.send({error: "Error al subir los ficheros de entrada/salida"});
                })
            }
            else {
                console.log("error al crear directorio")
                resp.status(500)
                resp.send({error:"Error al crear el directorio del reto"});
            }
        });
    })
}

function addSolucion (reto, solucion) {
    
    return new Promise((resolve, reject)=>{
        findByNombre(reto.nombre).then( function(nuevo) {
            
            return knex('solucion_reto').insert({
                reto: reto.id,
                entrada: solucion.entrada,
                salida: solucion.salida
            })
            .then(function(insertado) {
                if (insertado.length<1) {
                    reject({err:500});            
                }
                else {
                    resolve({data:insertado});
                }
            }) 
            
        }). catch(error => {
            reject({err:error});
        })
    })
}

function addReto (reto) {

    return new Promise((resolve, reject)=>{
        // buscamos si existe el reto a insertar
        findByNombre(reto.nombre).then( function(nuevo) {
            if(nuevo.data) {
                reject({err:403, message:"Ya existe un reto con este nombre"});
            }
        }).catch (error => {
            if (reto.descripcion) {
                knex('reto').insert({
                    nombre: reto.nombre,
                    descripcion: reto.descripcion
                })
                .then(function(insertado) {
                    if (insertado.length<1) {
                        reject({err:500});            
                    }
                    else {
                        reto.id = insertado[0];
                        resolve({data:reto});
                    }
                }) 
            } 
            else {
                reject({
                    err: 400,
                    message: "Faltan parametros"
                })
            }
        })  
    })         
        
}

function obtenerSoluciones(reto) {
    return new Promise((resolve, reject)=>{
        knex.select().from('solucion_reto').where("reto",reto)
        .then(function(datos){
            if(datos.length<1) {
                reject({err:404});
            }

            else {
                resolve({data:datos})
            }
        })
    })
} 

exports.obtenerSoluciones = obtenerSoluciones;