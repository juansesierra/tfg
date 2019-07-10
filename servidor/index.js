express = require('express')
Promise = require('bluebird')
bodyParser = require('body-parser')
fs = require('fs');
var cors = require('cors')

// variables globales
app = express()
jwt = require('jwt-simple');
fileUpload = require('express-fileupload');

Promise.promisifyAll(fileUpload);

app.use(cors());

// Para ejecutar comandos
exec = require('child_process');

// Para conectar con base de datos
knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./tfg_db.db"
  },
  useNullAsDefault: true
});


// Para subir archivos
app.use(fileUpload())

app.use(bodyParser.json());

require  ("./api/user.js");
require  ("./api/ejecutar.js");
require  ("./api/reto.js");


var server = app.listen(3000);

console.log("Servidor en marcha!");

module.exports = {
  server: server,
  app: app
}


