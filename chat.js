var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 2000;
var connections = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('newConnection', function(){
    connections += 1;
    io.sockets.emit('update', connections);
  });
  
  socket.on('disconnect', function(){
    connections -= 1;
    io.sockets.emit('update', connections);
  });
  
  socket.on('chat message', function(msg){
    io.emit('message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});