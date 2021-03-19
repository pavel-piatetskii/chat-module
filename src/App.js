import { useState, useEffect, Fragment } from "react"
import MessageFeed from "components/MessageFeed";
import UserList from "components/UserList";
import RoomList from "components/RoomList";
import GetUserName from "components/GetUserName";
import 'styles/responsive.scss'

//const PORT = env.PORT || 80;
const PORT = 3001;

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

const host = window.location.hostname;


function App() {

  const [currentRoom, setCurrentRoom] = useState(localStorage.getItem('currentRoom') || '');
  const [user, setUser] = useState(localStorage.getItem('username') || '');
  const [usersInRoom, setUsersInRoom] = useState('');
  const [existsMessage, setExistsMessage] = useState(false);
  
  const wss = new WebSocket(`ws://${host}:${PORT}`);

  wss.onmessage = (rep) => {
    console.log(JSON.parse(rep));
  }

  /**
   * 1. Establish a connection with a ws server API
   * 2. Send a username parameter there
   * 3. If "false" received (username doesn't exist in any room), 
   *    save name and show the chat.
   * 4. If "true" received (username exists in one of rooms), show the 
   *    error message
   * @param {*} username 
   */
  const saveUser = function(username) {

    wss.send(JSON.stringify({
      type: 'newUser',
      data: { username, room: currentRoom}
    }));

    //nameserver.onopen = () => {
    //  nameserver.send(JSON.stringify({ data: username }));
    //}
//
    //nameserver.onmessage = (rep) => {
    //  const { nameExists } = JSON.parse(rep.data);
    //  if (!nameExists) {
    //    setUser(username);
    //    localStorage.setItem('username', username);
    //    setCurrentRoom('1');
    //    localStorage.setItem('currentRoom', '1');
    //    nameserver.close();
    //  } else {
    //    setExistsMessage(true);
    //  }
    //}


  };
  
  useEffect(() => {
    //user && !wss && setWSS(new WebSocket(`ws://${host}:${data.rooms[currentRoom].port}`));
    //localStorage.setItem('wss', wss);
  }, [currentRoom]);
  //const [wss, setWSS] = useState(localStorage.getItem('wss') || '');
  const [isConnected, setIsConnected] = useState('');



  
  const switchRoom = function(roomNumber) {
    wss.send(JSON.stringify({ type: 'userClosed', data: user }));
    wss.close();
    //setWSS(prev => '');
    localStorage.setItem('username', '');
    setCurrentRoom(roomNumber);
    localStorage.setItem('currentRoom', roomNumber);
  };

  const createUsersObject = function(users) {
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
        <GetUserName saveUser={saveUser} existsMessage={existsMessage}/>
      )}
      {user && <div className="main">
        {usersInRoom && <UserList users={usersInRoom}/>}
        {isConnected && <MessageFeed
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
