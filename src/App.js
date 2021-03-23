import { useState, useEffect, Fragment } from "react"
import MessageFeed from "components/MessageFeed";
import UserList from "components/UserList";
import RoomList from "components/RoomList";
import GetUserName from "components/GetUserName";
import 'styles/responsive.scss'

const host = window.location.hostname;
//const PORT = env.PORT || 80;
const PORT = 3001;

const wss = new WebSocket(`ws://${host}:${PORT}`);

function App() {

  const [rooms, setRooms] = useState('');
  const [currentRoom, setCurrentRoom] = useState(localStorage.getItem('currentRoom') || '1');
  const [user, setUser] = useState(localStorage.getItem('username') || '');
  const [usersInRoom, setUsersInRoom] = useState('');
  const [existsMessage, setExistsMessage] = useState(false);

  const [messages, setMessages] = useState('');


  wss.onmessage = (message) => {
    console.log(JSON.parse(message.data));
    const { type, data } = JSON.parse(message.data);
    switch (type) {

      case 'init':
        initiateChat(data.username, data.roomsData)
        break;

      case 'userExist':
        setExistsMessage(true);
        break;

      case 'newMessage':
        addMessage({
          id: messages.length,
          time: new Date(),
          message: data.newMessage,
          sender: data.sender
        });
        break;

    case 'newUser':
      addUser(data.newUserRoom, data.newUserName)
      break;

    case 'userLeft':
      removeUser(data.oldUserRoom, data.oldUserName)
      break;
    }
  }

  useEffect(() => {
    rooms[currentRoom] && createUsersObject(rooms[currentRoom].users);
  }, [rooms[currentRoom]]);

  //useEffect(() => {
  //  setMessages(rooms[currentRoom].history);
  //}, [currentRoom]);

  /**
   * 1. Establish a connection with a ws server API
   * 2. Send a username parameter there
   * 3. If "false" received (username doesn't exist in any room), 
   *    save name and show the chat.
   * 4. If "true" received (username exists in one of rooms), show the 
   *    error message
   * @param {*} username 
   */
  const saveUser = function (username) {
    wss.send(JSON.stringify({
      type: 'newUser',
      data: { username, room: currentRoom }
    }));
  };

  const sendMessage = function (newMessage) {
    wss.send(JSON.stringify({
      type: 'newMessage',
      data: { room: currentRoom, sender: user, newMessage } 
    }));
  }
  const addMessage = function (newMessage) {
    setMessages((prev) => [...prev, newMessage])
  }

  /**
   * Update the 'rooms' state by adding a user to
   * a specific room. 
   * @param {*} room 
   * @param {*} username 
   */
  const addUser = function(room, username) {
    const updatedUsersInRoom = [...rooms[room].users, username];
    const updatedRoomData = { ...rooms[room], users: updatedUsersInRoom };
    const updatedRoomsData = { ...rooms, [room]: updatedRoomData };
    setRooms(updatedRoomsData);
  };

  const removeUser = function(room, username) {
    const updatedUsersInRoom = [...rooms[room].users].filter(user =>
      user !== username
      );
    const updatedRoomData = { ...rooms[room], users: updatedUsersInRoom };
    const updatedRoomsData = { ...rooms, [room]: updatedRoomData };
    setRooms(updatedRoomsData);
  };

  const initiateChat = function(username, roomsData) {
    setUser(username);
    //localStorage.setItem('username', username);
    setRooms(roomsData);
    setCurrentRoom('1');
    //localStorage.setItem('currentRoom', '1');
    createUsersObject(roomsData['1'].users);
    setMessages(roomsData['1'].history);
  };

  const switchRoom = function (roomNumber) {
    
    //wss.close();
    //setWSS(prev => '');
    //localStorage.setItem('username', '');
    wss.send(JSON.stringify({
      type: 'userSwitch',
      data: { userSwitch: user, oldRoom: currentRoom, newRoom: roomNumber }
    }));
    setCurrentRoom(roomNumber);
    //localStorage.setItem('currentRoom', roomNumber);
  };

  const createUsersObject = function (users) {
    let usersObject = {};
    users.map((user, index) =>
      usersObject[index] = {
        id: index,
        name: user,
        avatar: `https://avatars.dicebear.com/4.5/api/gridy/${user}.svg`
      })
    setUsersInRoom(usersObject);
  }

  return (
    <div className="App">
      {!user && (
        <GetUserName saveUser={saveUser} existsMessage={existsMessage} />
      )}
      {user && <div className="main">
        {usersInRoom && <UserList users={usersInRoom} />}
        {messages && <MessageFeed
          users={rooms[currentRoom].users}
          roomName={rooms[currentRoom].name}
          wss={wss}
          user={user}
          createUsersObject={createUsersObject}
          sendMessage={sendMessage}
          messages={messages}
        />}
        <RoomList
          rooms={rooms}
          currentRoom={currentRoom}
          switchRoom={switchRoom} />
      </div>}
    </div>
  );
}

export default App;
