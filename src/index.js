import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

const https = require('https');
const WebSocketServer = require('ws').server;

const httpsServer = https.createServer((req, res) => {
  console.log((new Date()) + " Received request for " + req.url);
  res.writeHead(404);
  res.end();
});

httpsServer.listen(3001, function() {
  console.log((new Date()) + " Server is listening on port 3001");
});

console.log("***CREATING WEBSOCKET SERVER");
const wsServer = new WebSocketServer({
    httpServer: httpsServer,
    autoAcceptConnections: false
});
console.log("***CREATED");

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
