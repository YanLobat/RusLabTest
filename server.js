"use strict";
var http = require('http'); 
//filesystem variable
var fs = require('fs');
//path variable
var path = require('path');
var hostname = '127.0.0.1';
var port = 1337;

var server = http.createServer(function(request, response) {
  	var url = request.url;//get current url
    url = url.split('?');//get uri
    console.log(url);
    switch(url[0]) {
      //default page
      case "/":
        fs.readFile("index.html", function(err, text){
          response.writeHead(200,{"Content-Type": "text/html"});
          response.end(text);
        });
        fs.readFile("app/test.json", function(err, text){
          response.writeHead(200,{"Content-Type": "application/json"});
        });
        break;
      //other supporting files
      default:
        //get extension of file
        var ext = path.extname(url[0]);
        var localPath = __dirname;
        var validExtensions = {
          ".html" : "text/html",      
          ".js": "application/javascript", 
          ".css": "text/css",
          ".txt": "text/plain",
          ".jpg": "image/jpeg",
          ".gif": "image/gif",
          ".png": "image/png",
          ".ttf": "font/truetype",
          ".ico":"image/x-icon",
          ".mp3": "audio/mpeg",
          ".json": "application/json"
        };
        var isValidExt = validExtensions[ext];
        if (isValidExt){
          localPath += url[0];
          fs.exists(localPath, function(exists) {
            if(exists) {
              console.log("Serving file: " + localPath);
              getFile(localPath, response, validExtensions[ext]);
            } else {
              console.log("File not found: " + localPath);
              response.writeHead(404);
              response.end();
            }
          });
        }
        else{
          console.log("Invalid file extension detected: " + ext)
        }
        break;
    }
});
server.listen(port, hostname, function() {
  console.log('Server running at http://'+hostname+':'+port+'/');
});
function getFile(localPath, res, mimeType) {
  fs.readFile(localPath, function(err, contents) {
    if(!err) {
      res.setHeader("Content-Length", contents.length);
      res.setHeader("Content-Type", mimeType);
      console.log(mimeType);
      res.statusCode = 200;
      res.end(contents);
    } else {
      res.writeHead(500);
      res.end();
    }
  });
}