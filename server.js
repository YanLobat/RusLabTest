"use strict";
var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//filesystem variable
var fs = require('fs');
//path variable
var path = require('path');
var hostname = '127.0.0.1';
var port = 1337;
var clients = [];
var clientIndex = -1;
Array.prototype.removefromArr = function(index){
  if (index == 0){
    this.shift();
  }
  else{
    this.splice(index,1); //cause it doesn't work with 1st element correctly
  }
};
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname));
io.on('connection', function(socket){
  console.log('a user connected');
  clientIndex++;
  //make our connection which stores user id and his likes/dislikes
  clients[clientIndex] = {};
  clients[clientIndex].liked = [];
  clients[clientIndex].disliked = [];
  clients[clientIndex].id = socket.id;
  var client = clients[clientIndex];
  var seen = [];
  clients = clients.filter(function(a){
    return typeof a !== 'undefined';
  });
  socket.on('getlikes',function(msg){
    io.emit('sendlikes',client.liked);
  });
  socket.on('getdislikes',function(msg){
    io.emit('senddislikes',client.disliked);
  });
  socket.on('like',function(msg){
    var file_content = fs.readFileSync("app/test.json");
    var content = JSON.parse(file_content);
    var items = content.items;
    for (var i = 0; i < items.length; i++){
      if (items[i].id == msg){
        if (client.liked.indexOf(msg) !=-1)
          break;
        client.liked.push(msg);
        items[i].likes++;
        items[i].liked_by.push(socket.id);
        //check if client has disliked this good before in connection
        for (var i = 0; i < client.disliked.length; i++){
          if (client.disliked[i] == msg){
            client.disliked.removefromArr(i);
            items[i].dislikes--;
            break;
          }
        }
        client.disliked = client.disliked.filter(function(a){
          return typeof a !== 'undefined';
        });
        break;
      }
    }
    fs.writeFileSync("app/test.json", JSON.stringify(content));
    io.emit('json', 'update');
  });
  socket.on('dislike',function(msg){
    var file_content = fs.readFileSync("app/test.json");
    var content = JSON.parse(file_content);
    var items = content.items;
    for (var i = 0; i < items.length; i++){
      if (items[i].id == msg){
        if (client.disliked.indexOf(msg) !=-1)
          break;
        client.disliked.push(msg);
        items[i].dislikes++;
        //check if user has liked this good before in connection
        for (var i = 0; i < client.liked.length; i++){
          if (client.liked[i] == msg){
            client.liked.removefromArr(i);
            break;
          }
        }
        client.liked = client.liked.filter(function(a){
          return typeof a !== 'undefined';
        });
        //check if user has liked this good before in json
        var pos = items[i].liked_by.indexOf(socket.id);
        if (pos !=-1){
          items[i].liked_by.removefromArr(pos);
          items[i].liked_by = items[i].liked_by.filter(function(a){
            return typeof a !== 'undefined';
          });
          items[i].likes--;
        }

        break;
      }
    }
    fs.writeFileSync("app/test.json", JSON.stringify(content));
    io.emit('json', 'update');
  });
  socket.on('seen',function(msg){
    var file_content = fs.readFileSync("app/test.json");
    var content = JSON.parse(file_content);
    var items = content.items;
    if (seen.indexOf(msg) == -1)
      seen.push(msg);
    if (seen.length == items.length)
      io.emit('seen', 'all');
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
    clients.removefromArr(clientIndex);
  });
});
http.listen(port, hostname, function() {
  console.log('Server running at http://'+hostname+':'+port+'/');
});
