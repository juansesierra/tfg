if(!app)
    throw new Error('Express no existe en este contexto. RuntimeException.')

//"capa" web (no aparecen referencias al API de Knex)
app.get("/retos/:id", function(pet, resp){
    let idReto = parseInt (pet.params.id);
    
    obtenerReto(idReto)
    .then(datos => {
        let soluciones = leerFicheroSoluciones(datos.data)
        var reto = {
            id: datos.data[0].id,
            nombre: datos.data[0].nombre,
            descripcion: datos.data[0].descripcion,
            dificultad: datos.data[0].dificultad,
            foto: datos.data[0].foto,
            soluciones: soluciones
        }
        reto.foto = fs.readFileSync(reto.foto, 'base64');
        resp.send({data:reto});
        
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

})

function obtenerReto(id) {
    
    return new Promise((resolve, reject)=>{
        knex('reto')
        .join('solucion_reto', 'reto.id', 'solucion_reto.reto').where('solucion_reto.reto', id)
        .select('reto.id as id',
            'reto.nombre as nombre', 
            'reto.descripcion as descripcion',
            'reto.dificultad as dificultad',
            'reto.foto as foto',
            'solucion_reto.entrada as entrada',
            'solucion_reto.salida as salida',
            'solucion_reto.id as id_solucion'
         ).then(datos => {
             if (datos.length>0) {
                 resolve({
                     data: datos
                 })  
            }
            else {
                reject ({
                    err: 404,
                    message: "No existe el reto buscado"
                })
            }
        })
    })
}

function leerFicheroSoluciones(reto) {
    let resp = [];
    let contador = 1;
    
    for (let solucion of reto) {
        resp.push ( {
            numero: contador,
            id: solucion.id_solucion,
            entrada : fs.readFileSync(solucion.entrada).toString(),
            salida : fs.readFileSync(solucion.salida).toString()
        })

        contador++;
    }

    return resp;
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
            for (var i=0; i<datos.data.length; i++) {
                datos.data[i].foto = fs.readFileSync(datos.data[i].foto, 'base64');
            }
            respuesta.data = datos.data;
            resp.send(respuesta);
        }
    }).catch(error => {
        if (error.err) {
            resp.status(error.err)
        }
        else {
            resp.status(500)
        }
        
        resp.send({error: error.message})
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

// listado con todos las retos
app.post("/misRetos", function(pet, resp){
    var respuesta = {
        data : 0
    }
    let usuario = parseInt (pet.body.usuario)

    listarMisRetos(usuario).then(datos => {
        if (datos.err) {
            resp.status(datos.err);
            resp.end();
        }
        else {
            for (var i=0; i<datos.data.length; i++) {
                datos.data[i].foto = fs.readFileSync(datos.data[i].foto, 'base64');
            }
            respuesta.data = datos.data;
            resp.send(respuesta);
        }
    }).catch(error => {
        if (error.err) {
            resp.status(error.err)
        }
        else {
            resp.status(500)
        }
        
        resp.send({error: error.message})
    })

})
 
function listarMisRetos(usuario) {
    
    return new Promise((resolve, reject)=>{
        knex.select().from('reto').where("usuario", usuario).then(datos => {
            resolve({
                data: datos
            })
        })
    })
}

// listado con todos las retos
app.post("/retosResueltos", function(pet, resp){
    var respuesta = {
        data : 0
    }
    let usuario = parseInt (pet.body.usuario)

    listarRetosResueltos(usuario).then(datos => {
        if (datos.err) {
            resp.status(datos.err);
            resp.end();
        }
        else {
            for (var i=0; i<datos.data.length; i++) {
                datos.data[i].foto = fs.readFileSync(datos.data[i].foto, 'base64');
            }
            respuesta.data = datos.data;
            resp.send(respuesta);
        }
    }).catch(error => {
        if (error.err) {
            resp.status(error.err)
        }
        else {
            resp.status(500)
        }
        
        resp.send({error: error.message})
    })

})
 
function listarRetosResueltos(usuario) {
    
    return new Promise((resolve, reject)=>{
        knex('reto')
        .join('reto_resuelto', 'reto.id', 'reto_resuelto.reto')
        .select('reto.id as id',
                'reto.nombre as nombre', 
                'reto.descripcion as descripcion', 
                'reto.foto as foto'
        ).where("reto_resuelto.usuario", usuario)
        .then(datos => {
            resolve({
                data: datos
            })  
        })
    })
}

app.get("/retosResueltos", function(pet, resp){

    var respuesta = {
        data : 0
    }

    let usuario = parseInt (pet.query.usuario)
    let reto = parseInt (pet.query.reto)
    

    obtenerRetoResuelto(usuario, reto).then(datos => {
        if (datos.err) {
            resp.status(datos.err);
            resp.end();
        }
        else {
            datos.data.fichero = fs.readFileSync(datos.data.fichero).toString()
            respuesta.data = datos.data;
            resp.send(respuesta);
        }
    }).catch(error => {
        if (error.err) {
            resp.status(error.err)
        }
        else {
            resp.status(500)
        }
        
        resp.send({error: error.message})
    })

})
 
function obtenerRetoResuelto(usuario, reto) {
    
    return new Promise((resolve, reject)=>{
        knex.select().from('reto_resuelto').where({
            'reto' : reto,
            'usuario' : usuario
        }).then(datos => {
            
            if (datos) {
                resolve({
                    data: datos[0]
                })  
            }
            else {
                reject({err:404});
            }
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

    if (req.files.foto) {
        nuevo.foto = "./retos/" + escape(nuevo.nombre) + "/" + req.files.foto.name;
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

                ficheros = subirArchivosAux(req, resp);
                resolve(ficheros);

            }
            else {
                console.log("error al crear directorio")
                resp.status(500)
                resp.send({error:"Error al crear el directorio del reto"});
            }
        });
    })
}

function subirArchivosAux(req, resp) {
    var ficheros = [];
    nombre_reto = escape(req.body.nombre)

    // recorremos el array de archivos
    for (let archivo in req.files) {
        nombre = "./retos/" + nombre_reto + "/" + req.files[archivo].name;
        
        let File = req.files[archivo];
        
        // Solo añadimos al array los ficheros que se van a procesar mas tarde
        if (archivo != 'foto') {
            ficheros.push(nombre);
        }
            
        // Subimos la entrada al servidor
        File.mv(nombre).then( function () {
            // Se ha subido correctamente
        }).catch(function (err){
            resp.status(500)
            resp.send({error: "Error al subir los ficheros de entrada/salida"});
        })

    }

    return ficheros;
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
                var nuevo = {
                    nombre: reto.nombre,
                    descripcion: reto.descripcion,
                    usuario: reto.usuario,
                    dificultad: reto.dificultad,
                }

                if (reto.foto != null) {
                    nuevo.foto = reto.foto;
                }

                knex('reto').insert(nuevo)
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

    if (req.files && req.files.foto) {
        reto.foto = "./retos/" + escape(reto.nombre) + "/" + req.files.foto.name;
    }
    
    try {
        updateReto(reto).
        then(function(editado){
            if (req.files) {

                var ficheros = subirArchivosAux(req, resp)

                var soluciones = crearSoluciones(ficheros);
            
                return addSolucion(reto, soluciones)
            }
            else {
                if(editado.err){
                    resp.status(editado.err)
                    resp.end()
                }else{
                    responseObj.data = "Reto modificado con éxito!";
                    resp.send(responseObj)
                }
            }
        }).then (response => {
            resp.status(200); // reto insertado               
            responseObj.data = "Reto modificado con éxito!";
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

function updateReto (reto) {
    return new Promise((resolve, reject)=>{

        // buscamos si existe el reto 
        knex('reto').where('id', reto.id).then (function (aux) {
            
            if(!aux[0]) {
                reject({err:404});
            }
            //Si existe lo editamos
            else {
                var nuevo = {
                    nombre: reto.nombre,
                    descripcion: reto.descripcion,
                    usuario: reto.usuario,
                    dificultad: reto.dificultad,
                }

                if (reto.foto != null) {
                    nuevo.foto = reto.foto;
                }

                knex('reto').where('id',reto.id).update(
                    nuevo
                )
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

function addResuelto (reto) {

    return new Promise((resolve, reject)=>{
        // buscamos si existe el reto a insertar
        knex.select().from('reto_resuelto').where( {"reto": reto.id, "usuario": reto.usuario})
            .then(function(datos){
                if (datos.length>=1) {
                    resolve({data:datos})
                }
                else {
                    knex('reto_resuelto').insert({
                        reto: reto.id,
                        usuario: reto.usuario,
                        fichero: reto.fichero
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

            })
    })         
        
}

app.delete('/solucion', function (req, resp) {
    let solucion = req.body;
    var responseObj = {};
    
    try {
        deleteSolucion(solucion,function(borrado){
			if(borrado.err){
				resp.status(borrado.err)
				resp.end()
			}else{
				responseObj.data = "Test eliminado con éxito!";
				resp.send(responseObj)
			}
		})
    } catch(err) {
        resp.status(500)
		resp.send({error:err.message})
    }
})

function deleteSolucion (solucion, callback) {
    // buscamos si existe la solucion a eliminar
    knex('solucion_reto').where('id', solucion.id).then (function (aux) {
        
        if(!aux[0]) {
            callback({err:404});
        }
        //Si existe lo borramos
        else {
            knex('solucion_reto').where('id',solucion.id).del()
            .then(function(borrado) {
                if (borrado<1) {
                    callback({err:500});            
                }
                else {
                    callback({data:borrado});
                }
            })  
        }
    }) 
             
}
exports.obtenerSoluciones = obtenerSoluciones;
exports.addResuelto = addResuelto;
