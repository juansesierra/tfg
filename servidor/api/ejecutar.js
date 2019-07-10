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
        
            return ejecutarPHP(codigo, soluciones[0].entrada)
        })
        .then(respuesta => {
            respuestaEjecucion = respuesta;
            var respuestaCompara = compararSalidas(soluciones[0].salida)        
       
            if (respuestaCompara == "") {
                responseObj.data = "Ejecucion correcta";
                responseObj.salida = respuestaEjecucion.salida;
            }
            else {
                responseObj.data = respuestaCompara;
                responseObj.salida = respuestaEjecucion.salida;
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
    }
    catch(err){
        resp.status(400);
        resp.send({error:err});
    }
    
})

function ejecutarPHP (codigo, entrada) {
    
    return new Promise((resolve, reject)=>{
        exec.exec('docker run --rm -v "$PWD":/Users/juansebastiansierraangel/tfg '+
        '-w /Users/juansebastiansierraangel/tfg php:7.2-cli php ' + codigo + " " + entrada,
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


function compararSalidas (salida_esperada) {
    var salida = '';
   
    try {
        salida = exec.execSync ('diff -w salida.txt ' + salida_esperada);
    }
    
    catch(ex) {
        // Ha diferencia entre los archivos
        salida = ex.stdout.toString();
        salida = salida.replace(/\\ No newline at end of file\n/gi, "");
        console.log("salida de comparar:")
        console.log(salida)
    }

    return salida;
}

