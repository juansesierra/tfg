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

// retodo con todos las retos
app.get("/retos", function(pet, resp){
    var respuesta = {
        data : 0
    }

    retorRetos().then(datos => {
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
 
function retorRetos() {
    
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
        .then (ficheros => {
            var soluciones = crearSoluciones(ficheros);
            
            return addSolucion(reto.data, soluciones)
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
    var ficheros = [];
    nombre_reto = escape(req.body.nombre)

    return new Promise((resolve, reject)=>{


        exec.exec ("mkdir ./retos/" + nombre_reto, function (error) {
            if (error == null) {

                // recorremos el array de archivos
                for (let archivo in req.files) {
                    nombre = "./retos/" + nombre_reto + "/" + req.files[archivo].name;

                    let File = req.files[archivo];

                    ficheros.push(nombre);

                    // Subimos la entrada al servidor
                    File.mv(nombre).then( function () {
                        // Se ha subido correctamente
                    }).catch(function (err){
                        resp.status(500)
                        resp.send({error: "Error al subir los ficheros de entrada/salida"});
                    })

                }

            }
            else {
                console.log("error al crear directorio")
                resp.status(500)
                resp.send({error:"Error al crear el directorio del reto"});
            }
        });
    })
}

function crearSoluciones(ficheros) {
    var soluciones = [];
    
    for (var i=0; i<ficheros.length; i=i+2) {
        soluciones.push( {
            entrada: ficheros[i],
            salida: ficheros[i+1]
        })
    }

    return soluciones;
    
}

function addSolucion (reto, soluciones) {
    return new Promise((resolve, reject)=>{
        findByNombre(reto.nombre).then( function(nuevo) {
            for (solucion of soluciones) {

                knex('solucion_reto').insert({
                    reto: reto.id,
                    entrada: solucion.entrada,
                    salida: solucion.salida
                })
                .then(function(insertado) {
                    if (insertado.length<1) {
                        reject({err:500});            
                    }
                    
                }) 
            }
            resolve();
            
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

app.put('/retos', function (req, resp) {
    let reto = req.body;
    var responseObj = {};
    
    try {
        updateReto(reto).
        then(function(editado){
			if(editado.err){
				resp.status(editado.err)
				resp.end()
			}else{
				responseObj.data = "Reto modificado con éxito!";
				resp.send(responseObj)
			}
        })
        .catch(error => {
            resp.status(error.err);
            resp.end();
        })
    } catch(err) {
        resp.status(500)
		resp.send({error:err.message})
    }
})

function updateReto (reto) {
    return new Promise((resolve, reject)=>{

        // buscamos si existe el reto 
        knex('reto').where('id', reto.id).then (function (aux) {
            
            if(!aux[0]) {
                reject({err:404});
            }
            //Si existe lo editamos
            else {
                console.log(reto);
                knex('reto').where('id',reto.id).update({
                    nombre: reto.nombre,
                    descripcion: reto.descripcion
                })
                .then(function(editado) {
                    if (editado<1) {
                        reject({err:500});            
                    }
                    else {
                        resolve({data:editado});
                    }
                })  
            }
            
        })

    })
}

exports.obtenerSoluciones = obtenerSoluciones;