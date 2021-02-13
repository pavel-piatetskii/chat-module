import { useState } from "react"
import MessageFeed from "./MessageFeed";
import UserList from "./UserList";
import RoomList from "./RoomList";

//const WebSocket = require('ws');

const data = {
  users: {
    '1': { id: 1, name: 'Jake', avatar: 'https://avatars.dicebear.com/4.5/api/gridy/1.svg'},
    '2': { id: 2, name: 'Jane', avatar: 'https://avatars.dicebear.com/4.5/api/gridy/2.svg'}
  },
  messages: [
    { id: 1, room: 1, sender: 1, message: 'Hi!', time: new Date("2021-02-01:00:00") },
    { id: 2, room: 1, sender: 2, message: 'Hello! How\'r U?', time: new Date("2021-02-01:00:01") },
    { id: 3, room: 1, sender: 1, message: 'Good :)!', time: new Date("2021-02-01:00:02") }
  ],
  rooms: {
    '1': { id: 1, name: 'Main Room', image: 'http://forums.civfanatics.com/images/war_academy/civ5/civs/big/greece.png' },
    '2': { id: 2, name: 'Offtopic', image: 'http://forums.civfanatics.com/images/war_academy/civ5/civs/big/aztec.png' }
  }
};


function App() {

  return (
    <div className="App">
      <h1>Hello!</h1>
      <div className="main">
        <UserList users={data.users}/>
        <MessageFeed users={data.users} messages={data.messages} />
        <RoomList rooms={data.rooms}/>
      </div>
    </div>
  );
}

export default App;
