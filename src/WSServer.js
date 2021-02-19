'use strict'
const http = require('http');
const WebSocket = require('ws');

console.log("--- Creating Websocket servers for all Rooms");
const wsServer3001 = new WebSocket.Server({ port: 3001 });
const wsServer3002 = new WebSocket.Server({ port: 3002 });
//const wsServers3001 = [new WebSocket.Server({ port: 3001 }), new WebSocket.Server({ port: 3002 })];
console.log("***CREATED");

//let connections = [];
//let history = [];

let connections3001 = [];
let history3001 = [];
let connections3002 = [];
let history3002 = [];

//let connections = { 'main': [], 'offtopic': [] };
//let history = { 'main': [], 'offtopic': [] };

wsServer3001.on('connection', ws => {
  //console.log(ws.server)
  //ws.on('open', () => console.log('New connection on port 3001'))
  console.log('New connection on port 3001')
  ws.send(JSON.stringify({ history: history3001 }));
  connections3001.push(ws);

  ws.on('message', (message) => {
    console.log('3001: ' + message);
    history3001.push({ id: history3001.length, message, time: new Date() });
    connections3001.map(ws => ws.send(message));
  })
})

wsServer3002.on('connection', ws => {
  //console.log(ws.server)
  console.log('New connection on port 3002')
  ws.send(JSON.stringify({ history: history3002 }));
  connections3002.push(ws);

  ws.on('message', (message) => {
    console.log('3002: ' + message);
    history3002.push({ id: history3002.length, message, time: new Date() });
    connections3002.map(ws => ws.send(message));
  })
})
