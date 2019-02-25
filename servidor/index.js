express = require('express')
bodyParser = require('body-parser')
fs = require('fs');
var cors = require('cors')

// variables globales
app = express()
jwt = require('jwt-simple');
multer = require('multer');

app.use(cors());

exec = require('child_process').exec;

function capturaError (error, stdout)  {
  // controlamos el error
  if (error !== null) {
      console.log('exec error: ' + error);
      return {err:500};
  }
  else {
      console.log (stdout);
      return stdout;
  }
} 

app.use(bodyParser.json());

require  ("./api/user.js");
require  ("./api/ejecutar.js");

var server = app.listen(3000);

console.log("Servidor en marcha!");

module.exports = {
  server: server,
  app: app
}


