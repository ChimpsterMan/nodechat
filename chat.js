var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 2000;
var fs = require('fs');
//var ls = require('line-by-line');
var connections = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('newConnection', function(){
    connections += 1;
    io.sockets.emit('update', connections);
    
    /*var count = 0;
    lr = new ls('./logs/log.txt');
    lr.on('error', function (err) {
      // 'err' contains error object
    });
    lr.on('line', function (line) {
      count += 1;
      socket.emit('message', line);
    });
    lr.on('end', function () {
      // All lines are read, file is closed now.
    });*/
  });
  
  socket.on('disconnect', function(){
    connections -= 1;
    io.sockets.emit('update', connections);
  });
  
  socket.on('command', function(c){
    if (c == "reload"){io.sockets.emit('reload');}
    if (c == "log clear"){resetLog();}
  });
  
  socket.on('chat message', function(msg){
    io.sockets.emit('message', msg);
    writeLog(msg);
  });
});

function writeLog(msg){
  fs.appendFile("./logs/log.txt", msg + "\n", function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("Message was logged");
  }); 
}

function resetLog(){
  fs.writeFile("./logs/log.txt", '', function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("Log cleared");
  }); 
}

http.listen(port, function(){
  console.log('listening on *:' + port);
});