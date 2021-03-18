import { useState, useEffect, Fragment } from "react"
import MessageFeed from "components/MessageFeed";
import UserList from "components/UserList";
import RoomList from "components/RoomList";
import GetUserName from "components/GetUserName";
import 'styles/responsive.scss'

const data = {
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

  const [currentRoom, setCurrentRoom] = useState(localStorage.getItem('currentRoom') || '');
  const [user, setUser] = useState(localStorage.getItem('username') || '');
  const [usersInRoom, setUsersInRoom] = useState('');
  
  const saveUser = function(username) {
    setUser(username);
    //localStorage.setItem('username', username);
    setCurrentRoom('1');
    localStorage.setItem('currentRoom', '1');
  };
  
  useEffect(() => {
    console.log(window.location.hostname)
    user && !wss && setWSS(new WebSocket(`ws://${window.location.hostname}:${data.rooms[currentRoom].port}`));
    localStorage.setItem('wss', wss);
  }, [currentRoom]);
  const [wss, setWSS] = useState(localStorage.getItem('wss') || '');



  
  const switchRoom = function(roomNumber) {
    wss.send(JSON.stringify({ type: 'userClosed', data: user }));
    wss.close();
    setWSS(prev => '');
    localStorage.setItem('username', '');
    setCurrentRoom(roomNumber);
    localStorage.setItem('currentRoom', roomNumber);
  };

  const createUsersObject = function(users) {
    //setUsersInRoom = (prev) => '';
    let usersObject = {};
    users.map((user, index) => 
      usersObject[index] = {
        id: index,
        name: user,
        avatar: `https://avatars.dicebear.com/4.5/api/gridy/${user}.svg`
      })
    setUsersInRoom(usersObject)
  }

  return (
    <div className="App">
      {!user && (
        <GetUserName saveUser={saveUser}/>
      )}
      {user && <div className="main">
        {usersInRoom && <UserList users={usersInRoom}/>}
        {wss && <MessageFeed
          users={data.users}
          roomName={data.rooms[currentRoom].name}
          wss={wss}
          user={user}
          createUsersObject={createUsersObject}
        />}
        <RoomList rooms={data.rooms} currentRoom={currentRoom} changeRoom={switchRoom}/>
      </div>}
    </div>
  );
}

export default App;
