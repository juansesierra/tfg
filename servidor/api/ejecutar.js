if(!app)
    throw new Error('Express no existe en este contexto. RuntimeException.')

app.post("/ejecutar", function(req, resp){
    //var token = req.headers.token;
    let lenguaje = parseInt(req.body.lenguaje); // Lenguaje que va a ejecutar la aplicacion
    var responseObj = {};

    let fichero = req.body.fichero;

    // Escribimos el contenido en un nuevo fichero
    fs.writeFileSync("hola.php", fichero)

    try {
        ejecutarPHP(function (respuesta) {
            if (respuesta.err == "") {
                compararSalidas(function (respuestaCompara) {
                    
                    if (respuestaCompara.estado == 200) {
                        if (respuestaCompara.err == "") {
                            responseObj.data = "Ejecucion correcta";
                        }
                        else {
                            responseObj.data = respuestaCompara.err;
                        }

                        resp.send(responseObj);
                    }
                    else {
                        resp.status(500)
                        resp.send({error:respuestaCompara.err.message})
                    }
                })
            }
            else {
                resp.status(500)
                resp.send({error:respuesta.err})
            }
        });     
    }
    catch(err){
        resp.status(400);
        resp.send({error:err.message});
    }
    
})

function ejecutarPHP (callback) {
    exec('docker run --rm -v "$PWD":/Users/juansebastiansierraangel/tfg '+
    '-w /Users/juansebastiansierraangel/tfg php:7.2-cli php hola.php > salida.txt',
    // Pasamos los parámetros error, stdout la salida 
    // que mostrara el comando
    function (error) {
        // controlamos el error
        if (error !== null) {
            console.log('exec error: ' + error);
            callback({err : error});
        }
        else {
            callback({err : ""})
        }
    }); 
}

function compararSalidas (callback) {
    exec('diff -w salida.txt salida_esperada.txt',
    // Pasamos los parámetros error, stdout la salida 
    // que mostrara el comando
    function (error, salida, stderr) {

        console.log ("salida: " + salida)
        // controlamos el error
        if (salida !== null) {
            // Hay diferencias entre los archivos, por lo tanto hay un error
            if (salida !== null) {
                callback({err : salida, estado: 200})
            }
            else {
                callback({err : "", estado: 200})
            }
        }
        else {
            console.log('exec error: ' + error);
            callback({err : error, estado: 500});
        }
    }); 
}


