'use strict'
const http = require('http');
const WebSocket = require('ws');
/*
const httpServer = http.createServer();

httpServer.listen(3001, () => {
  console.log((new Date()) + " Server is listening on port 3001");
});
*/

console.log("***CREATING WEBSOCKET SERVER");
const wsServer = new WebSocket.Server({ port: 3001 });
console.log("***CREATED");

let connections = []
let history = []

wsServer.on('connection', ws => {
  ws.send(JSON.stringify({ history }));
  connections.push(ws)

  ws.on('message', (message) => {
    console.log(message)
    history.push({ message, time: new Date() })
    connections.map(ws => ws.send(message))
  })
})


//wsServer.on('request', (request) => {
//  const connection = request.accept(null, request.origin)
//})

//wsServer.on('request', (request) => {
//  const connection = request.accept(null, request.origin)
//})

/*
const http = require('http');
var server = http.createServer((req, res) => {
res.writeHead(200, {'Content-type':'text/html'});
res.end('<h1>Hello NodeJS</h1>');
}).listen(3000, 'localhost');

server.listen(3000,() => console.log('Server running on port localhost:3000'));
*/