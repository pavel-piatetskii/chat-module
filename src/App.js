import { useState, useEffect, Fragment } from "react"
import MessageFeed from "components/MessageFeed";
import UserList from "components/UserList";
import RoomList from "components/RoomList";

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
    '1': {
      id: 1,
      name: 'Main Room',
      image: 'http://forums.civfanatics.com/images/war_academy/civ5/civs/big/greece.png',
      port: 3001
    },
    '2': {
      id: 2,
      name: 'Offtopic',
      image: 'http://forums.civfanatics.com/images/war_academy/civ5/civs/big/aztec.png',
      port:3002  
    }
  }
};


function App() {

  const [currentRoom, setCurrentRoom] = useState('1');
  const [user, setUser] = useState('');
  
  useEffect(() => {
    user && setWSS(new WebSocket(`ws://192.168.1.163:${data.rooms[currentRoom].port}`))
  }, [currentRoom]);
  const [wss, setWSS] = useState('');


  
  const switchRoom = function(roomNumber) {
    wss.close();
    setCurrentRoom(roomNumber);
  };

  return (
    <div className="App">
      {!user && (
        <Fragment>
          <h1>Hi! Looks like you're new here. What's your name?</h1>
        </Fragment>
      )}
      {user && <div className="main">
        <UserList users={data.users}/>
        {wss && <MessageFeed
          users={data.users}
          wss={wss}
        />}
        <RoomList rooms={data.rooms} currentRoom={currentRoom} changeRoom={switchRoom}/>
      </div>}
    </div>
  );
}

export default App;
