if(!app)
    throw new Error('Express no existe en este contexto. RuntimeException.')

app.post("/ejecutar", function(req, resp){
    //var token = req.headers.token;
    let lenguaje = parseInt(req.body.lenguaje); // Lenguaje que va a ejecutar la aplicacion
    var responseObj = {};
    var respuestaEjecucion;

    let fichero = req.body.codigo;
    

    // Escribimos el contenido en un nuevo fichero
    fs.writeFileSync("hola.php", fichero)

    try {
        ejecutarPHP()
        .then(respuesta => {
            respuestaEjecucion = respuesta;
            return compararSalidas()        
        })
        .then (respuestaCompara => {
            console.log(respuestaCompara);
            if (respuestaCompara.err == "") {
                responseObj.data = "Ejecucion correcta";
                responseObj.salida = respuestaEjecucion.salida;
            }
            else {
                responseObj.data = respuestaCompara.err;
                responseObj.salida = respuestaEjecucion.salida;
            }

            resp.send(responseObj);
        })
        .catch(respuesta => {
            console.log(respuesta);
            resp.status(500)
            resp.send({error:respuesta.err})
        });     
    }
    catch(err){
        resp.status(400);
        resp.send({error:err});
    }
    
})

function ejecutarPHP () {
    
    return new Promise((resolve, reject)=>{
        exec('docker run --rm -v "$PWD":/Users/juansebastiansierraangel/tfg '+
        '-w /Users/juansebastiansierraangel/tfg php:7.2-cli php hola.php',
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

                fs.writeFileSync("salida.txt", salida)

                resolve({err : "", salida: salida})
            }
        }); 
    })
}

function compararSalidas () {
    return new Promise((resolve, reject)=>{
        exec('diff -w salida.txt salida_esperada.txt',
        // Pasamos los parámetros error, stdout la salida 
        // que mostrara el comando
        function (error, salida, stderr) {

            console.log ("salida comparar: " + salida)
            console.log("error interno al comparar:" + error)
            
            // controlamos el error
            if (error !== null) {
                // Hay diferencias entre los archivos, por lo tanto hay un error
                if (salida !== null) {
                    salida = salida.replace(/\\ No newline at end of file/gi, "")
                    resolve({err : salida})
                }
                else {
                    console.log('exec error: ' + error);
                    reject({err : salida});
                }
            }
            else {
                resolve({err : ""})
            }
        }); 
    })
}


