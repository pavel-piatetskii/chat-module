'use strict'
const http = require('http');
const WebSocket = require('ws');

console.log('*** CREATING ROOMS');
const rooms = {
  '1': {
    server: new WebSocket.Server({ port: 3001 }),
    port: 3001,
    connections: [],
    history: [],
    users: [],
  },
  '2': {
    server: new WebSocket.Server({ port: 3002 }),
    port: 3002,
    connections: [],
    history: [],
    users: [],
  },
}

for (const room in rooms) {

  const { server, port, connections, history } = rooms[room];
  let { users } = rooms[room];

  server.on('connection', ws => {
    console.log(`New connection on port ${port}`)

    ws.send(JSON.stringify({ type: 'history', data: history }));
    connections.push(ws);

    ws.on('message', (message) => {
      const { type, data } = JSON.parse(message);
      console.log(`${type}: ${data}`);

      switch (type) {
        case 'newMessage':
          history.push({
            id: history.length,
            message: data, time: new Date()
          });
          connections.map(ws =>
            ws.send(JSON.stringify({ type, data }))
          );
          break;
        case 'newUser':
          users.push(data);
          connections.map(ws => ws.send(JSON.stringify({ type: 'users', data: users })));
          break;
        case 'userClosed':
          users = users.filter(user => user != data)
          connections.map(ws => ws.send(JSON.stringify({ type: 'users', data: users })));
      }
    })
  })

  console.log(`*** CREATED ROOM ON PORT ${port}`);

}
console.log("*** ALL ROOMS CREATED");