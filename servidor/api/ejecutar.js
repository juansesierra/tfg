const ApiR = require  ("./reto.js");

if(!app)
    throw new Error('Express no existe en este contexto. RuntimeException.')

app.post("/ejecutar", function(req, resp){
    //var token = req.headers.token;
    let lenguaje = parseInt(req.body.lenguaje); // Lenguaje que va a ejecutar la aplicacion
    var responseObj = {};
    var respuestaEjecucion;

    let fichero = req.body.codigo;
    var codigo = req.body.idReto+ "_" + req.body.usuario + ".php";
    var soluciones;

    // Escribimos el contenido en un nuevo fichero
    fs.writeFileSync(codigo, fichero)

    try {
        // Obtenemos los datos del rato pasado por parametro
        ApiR.obtenerSoluciones(req.body.idReto)
        .then(datos => {
            soluciones = datos.data;

            console.log(soluciones)

            var ejecuciones = ejecutarPHP(codigo, soluciones)
            
            Promise.all(ejecuciones).then(salidas => {
                
                var comparaOk = true;
                responseObj.ejecuciones = [];

                for (var i = 0; i<salidas.length && comparaOk; i++) {
                    respuestaEjecucion = salidas[i].salida;
                    var fichero_salida = "salida_" + i + ".txt";
                    
                    ejecucion = {
                        id: i+1,
                        entrada : fs.readFileSync(soluciones[i].entrada).toString(),
                        salida_esperada: fs.readFileSync(soluciones[i].salida).toString(),
                        salida: respuestaEjecucion
                    }
                    responseObj.ejecuciones.push(ejecucion);

                    console.log("salida esperada: " + soluciones[i].salida)

                    comparaOk = compararSalidas(fichero_salida, soluciones[i].salida)        
                }
        
                if (comparaOk) {
                    responseObj.data = "Ejecución correcta";
                    let reto = {
                        id: req.body.idReto,
                        usuario: req.body.idUsuario
                    }


                    ApiR.addResuelto(reto).then(salida => {
                        // añadimos a retos resueltos por el usuario
                        console.log("aaa")
                        console.log(salida)
                    })
                }
                else {
                    responseObj.data = "Ejecución incorrecta";
                }


                resp.send(responseObj);
            })
            .catch(respuesta => {
                console.log(respuesta);
                if (respuesta.err && respuesta.err== '404') {
                    resp.status(404);
                    resp.send();
                }
                else {
                    resp.status(500)
                    resp.send({error:respuesta.err})
                }
            });     
        });
    }
    catch(err){
        resp.status(400);
        resp.send({error:err});
    }
    
})

function ejecutarPHP (codigo, entradas) {
    var promesas = [];
    var contador = 0;
    
    for (var i=0; i<entradas.length; i++) {
        promesas.push(new Promise((resolve, reject)=>{
            // Recorremos todas las entradas
            
            exec.exec('docker run --rm -v "$PWD":/Users/juansebastiansierraangel/tfg '+
            '-w /Users/juansebastiansierraangel/tfg php:7.2-cli php ' + codigo + " " + entradas[i].entrada,
            // Pasamos los parámetros error, stdout la salida 
            // que mostrara el comando
            function (error, salida) {
                // controlamos el error
                if (error !== null) {
                    console.log("error ejecucion: " + salida)
                    console.log ("error interno ejecucion:" + error)
                    reject({err : salida});
                }
                else {
                    console.log ("Salida de la ejecucion: " + salida)
                    console.log ("Salida de la ejecucion error: " + error)
    
                    fs.writeFileSync("salida_" + contador + ".txt", salida)
                    contador++;

                    resolve({err : "", salida: salida})
                }
            }); 
         
        }))
    }

    return promesas;

}


function compararSalidas (fichero_salida, salida_esperada) {
    var salida = '';
    var ok = true;
   
    try {
        salida = exec.execSync ('diff -w '+ fichero_salida + ' ' + salida_esperada);
    }
    
    catch(ex) {
        // Ha diferencia entre los archivos
        salida = ex.stdout.toString();
        salida = salida.replace(/\\ No newline at end of file\n/gi, "");
        console.log("salida de comparar:")
        console.log(salida)
        ok = false;
    }

    return ok;
}

