var express = require("express");
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var routercarwash = require('./router/routercarwash');

var http = require('http').Server(app);
var io = require('socket.io')(http);

const PORT = process.env.PORT || 666;

app.use(bodyParser.json());

app.use(express.static('APP'));

var path = __dirname + '/'

//manejador de rutas
router.use(function (req,res,next) {
  /*
      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', '*');
      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name, pplication/json');
        // Set to true if you need the website to include cookies in the requests sent
      res.setHeader('Access-Control-Allow-Credentials', true);
*/
  console.log("/" + req.toString());
  next();
});



app.get("/",function(req,res){
	res.sendFile(path + 'index.html');
}); 

//Router para el carwash
app.use('/carwash', routercarwash);

app.use("/",router);

app.use("*",function(req,res){
  res.send('NO DISPONIBLE');
  //res.sendFile(path + "APP/views/404.html");
});

/*
app.listen(PORT, function () {
	console.log('Servidor iniciado en el puerto ' + String(PORT));
});
*/

io.on('connection', function(socket){
	socket.on('orden nueva', function(msg,user){
	  io.emit('orden nueva', msg, user);
  });
  socket.on('orden eliminada', function(msg,user){
	  io.emit('orden eliminada', msg, user);
  });

});

http.listen(PORT, function(){
  console.log('listening on *:' + PORT);
});


/*CODIGO PARA EL HTML Y SOCKET
   $(function () {
        var socket = io();
        $('form').submit(function(){
          socket.emit('chat message', $('#m').val());
          $('#m').val('');
          return false;
        });
        socket.on('chat message', function(msg){
          $('#messages').append($('<li>').text(msg));
          window.scrollTo(0, document.body.scrollHeight);
        });
      });
*/