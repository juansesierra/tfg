if(!app)
    throw new Error('Express no existe en este contexto. RuntimeException.')


//"capa" web (no aparecen referencias al API de Knex)
app.get("/users", function(pet, resp){
    var token = pet.headers.token;

    try {
        var decoded = jwt.decode(token, 'credencial');
    
        if (!decoded) {
            resp.status(401);
            resp.send(); 
        }
        else {
            listarUsuarios(function(datos){
                resp.send(datos)
            })
        }
    }
    catch(err){
		resp.status(400)
		resp.send({error:err.message})
	}
    
    

})

//"capa" de acceso a datos (no aparecen referencias al API de Express)
function listarUsuarios(callback) {
    knex.select().from('Usuario')
    .then(function(datos){
      callback(datos)
    })
}

app.get("/users/:id", function(pet, resp){
    let idUsuario = parseInt(pet.params.id);
    obtenerUsuario(idUsuario, function(datos){
        if (datos.err) {
            resp.status(datos.err);
            resp.end();
        }
        else {
            datos[0].foto = fs.readFileSync(datos[0].foto, 'base64');

            resp.send({data: datos[0]});
        }
    })

})


//"capa" de acceso a datos (no aparecen referencias al API de Express)
function obtenerUsuario(idUsuario, callback) {
    knex.select().from('Usuario').where("id", idUsuario)
    .then(function(datos){
        if (datos.length<1) {
            callback({err:404});
        }
        else {
            callback(datos);
        }

    })
}

function findByLogin(login, callback) {
    if (login) {
        knex.select().from('Usuario').where("login", login)
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

app.post('/login',function(req,resp){
    resp.setHeader('Access-Control-Allow-Origin','*')
    var responseObj = {}
    
	try{
		let credenciales = req.body
		//login debe tener, al menos, login y password
		login(credenciales,function(user){
			if(user.err){
				resp.status(user.err)
				resp.end()
			}else{
				responseObj.data = user.data[0];
				responseObj.token = jwt.encode(user.data, 'credencial')
				resp.send(responseObj)
			}
		})
	}catch(err){
		resp.status(500)
		resp.send({error:err.message})
	}
})

function login (credenciales,callback) {
    if(credenciales.login && credenciales.password){
        knex.select().from("Usuario").where({login:credenciales.login})
        .then(function(datos){
            if(datos.length<1) {
                callback({err:404});
            }

            else {
                bcrypt.compare(credenciales.password, datos[0].password).then(function(res) {
                    if (res) {
                        callback({data:datos})
                    }
                    else {
                        callback({err:403});
                    }
                });
            }

        });

    }else{
        callback({err:400})
    }
}

app.post('/users', function (req, resp) {
    let usuario = req.body;
    var responseObj = {};
    
    try {
        addUser(usuario,function(user){
			if(user.err){
                resp.status(user.err)
				resp.send({error: user.message})
			}else{
                resp.status(201); // usuario insertado 
				responseObj.data = "Usuario insertado con éxito!";
				resp.send(responseObj)
			}
		})
    } catch(err) {
        resp.status(500)
		resp.send({error:err.message})
    }
})

function addUser (usuario, callback) {
    // buscamos si existe el usuario a insertar
    findByLogin(usuario.login, function(nuevo) {
        if(nuevo.data) {
            callback({err:403});
        }
        //Si no existe lo insertamos 
        else {
            if (usuario.login && usuario.password && usuario.email) {
                // ciframos la contraseña
                bcrypt.hash(usuario.password, 10).then(function(hash) {
                    knex('Usuario').insert({login: usuario.login, password: hash, email: usuario.email})
                    .then(function(insertado) {
                        if (insertado.length<1) {
                            callback({err:500});            
                        }
                        else {
                            callback({data:insertado});
                        }
                    })  
                });
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

app.delete('/users', function (req, resp) {
    let usuario = req.body;
    var responseObj = {};
    
    try {
        deleteUser(usuario,function(user){
			if(user.err){
				resp.status(user.err)
				resp.end()
			}else{
				responseObj.data = "Usuario eliminado con éxito!";
				resp.send(responseObj)
			}
		})
    } catch(err) {
        resp.status(500)
		resp.send({error:err.message})
    }
})

function deleteUser (usuario, callback) {
    // buscamos si existe el usuario a eliminar
    findByLogin(usuario.login, function(nuevo) {
        if(!nuevo.data) {
            callback({err:404});
        }
        //Si existe lo borramos
        else {
            knex('Usuario').where('login',usuario.login).del()
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

app.put('/users', function (req, resp) {
    let usuario = req.body;
    var responseObj = {};


    if (req.files && req.files.foto) {
    
        let File = req.files.foto;
            
        // Subimos la entrada al servidor
        File.mv(req.files.foto.name).then( function () {
            // Se ha subido correctamente
        }).catch(function (err){
            resp.status(500)
            resp.send({error: "Error al subir la foto de perfil"});
        })

        usuario.foto = './' + req.files.foto.name;
    }

    try {
        updateUser(usuario,function(user){
			if(user.err){
				resp.status(user.err)
				resp.end()
			}else{
				responseObj.data = "Usuario modificado con éxito!";
				resp.send(responseObj)
			}
		})
    } catch(err) {
        resp.status(500)
		resp.send({error:err.message})
    }
})

function updateUser (usuario, callback) {
    // buscamos si existe el usuario a eliminar
    findByLogin(usuario.login, function(nuevo) {
        if(!nuevo.data) {
            callback({err:404});
        }
        //Si existe lo editamos
        else {
            bcrypt.hash(usuario.password, 10).then(function(hash) {
                if (usuario.password == '') {
                    hash = nuevo.data.password; // Si coinciden no actualizamos 
                }
                let editar = {
                    password: hash,
                    email: usuario.email
                }

                // Si tiene foto la cambiamos
                if (usuario.foto) {
                    editar.foto = usuario.foto
                }

                knex('Usuario').where('login',usuario.login).update(editar)
                .then(function(editado) {
                    if (editado<1) {
                        callback({err:500});            
                    }
                    else {
                        callback({data:editado});
                    }
                })
            })
        }
            
        
    })  
             
        
}

