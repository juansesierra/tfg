if(!app)
    throw new Error('Express no existe en este contexto. RuntimeException.')

//"capa" web (no aparecen referencias al API de Knex)
app.get("/retos/:id", function(pet, resp){
    let idReto = parseInt (pet.params.id);
    obtenerReto(idReto, function(datos){
        if (datos.err) {
            resp.status(datos.err);
            resp.end();
        }
        else {
            resp.send(datos);
        }
    })

})

function obtenerReto(id, callback) {
    knex.select().from('reto').where("id",id)
    .then(function(datos){
        if(datos.length<1) {
            callback({err:404});
        }

        else {
            callback({data:datos[0]})
        }
    })
}  

// listado con todos las retos
app.get("/retos", function(pet, resp){
    var respuesta = {
        data : 0
    }

    listarRetos(function(datos){
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
 
function listarRetos(callback) {
    
    knex.select().from('reto').then(function(datos){
        callback({
            data: datos
        })
    })
}

function findByNombre(nombre, callback) {
    
    if (nombre) {
        knex.select().from('reto').where("nombre", nombre)
        .then(function(datos){
            if (datos.length<1) {
                callback({err:404});
            }
            else {
                callback({data:datos[0]});
            }

        })
    }
    else {
        callback({err:404});
    }
    
}

app.post('/retos', function (req, resp) {
    let nueva = req.body;
    var responseObj = {};

    if (req.files) {
        
    }
    
    try {
        addReto(nueva, function(reto){
			if(reto.err){
                resp.status(reto.err)
				resp.send({error: reto.message})                
			}else{
                subirArchivos(req, resp, solucion =>  {
                    console.log(solucion)
                    addSolucion(reto.data, solucion, response => {
                       
                        if (response.err) {
                            resp.status(reto.err)
				            resp.send({error: reto.message})
                        }
                        else {
                            resp.status(201); // reto insertado               
                            responseObj.data = "reto insertado con éxito!";
                            resp.send(responseObj)
                        }
                    })
                });
			}
		})
    } catch(err) {
        resp.status(500)
		resp.send({error:err.message})
    }
})

function subirArchivos (req, resp, callback) {
    var solucion = {};

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
            
                callback(solucion);

            }).catch(function (err){
                resp.status(500)
                resp.send({error: "Error al subir los ficheros de entrada/salida"});
            })
        }
        else {
            resp.status(500)
            resp.send({error:"Error al crear el directorio del reto"});
        }
    });
}

function addSolucion (reto, solucion, callback) {
    
    findByNombre(reto.nombre, function(nuevo) {
        if(nuevo.err) {
            callback({err:nuevo.err});
        }
        //Si no existe lo insertamos 
        else {
            knex('solucion_reto').insert({
                reto: reto.id,
                entrada: solucion.entrada,
                salida: solucion.salida
            })
            .then(function(insertado) {
                if (insertado.length<1) {
                    callback({err:500});            
                }
                else {
                    callback({data:insertado});
                }
            }) 
        }
    })
}

function addReto (reto, callback) {
    // buscamos si existe el reto a insertar
    findByNombre(reto.nombre, function(nuevo) {
        if(nuevo.data) {
            callback({err:403, message:"Ya existe un reto con este nombre"});
        }
        //Si no existe lo insertamos 
        else {
            if (reto.descripcion) {
                knex('reto').insert({
                    nombre: reto.nombre,
                    descripcion: reto.descripcion
                })
                .then(function(insertado) {
                    if (insertado.length<1) {
                        callback({err:500});            
                    }
                    else {
                        reto.id = insertado[0];
                        callback({data:reto});
                    }
                }) 
            } 
            else {
                callback({
                    err: 400,
                    message: "Faltan parametros"
                })
            }
        }
    })  
             
        
}