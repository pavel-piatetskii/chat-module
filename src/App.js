import { useState, useEffect, Fragment } from "react"
import MessageFeed from "components/MessageFeed";
import UserList from "components/UserList";
import RoomList from "components/RoomList";
import GetUserName from "components/GetUserName";


const host = process.env.REACT_APP_WSHOST || 'quiet-sands-19521-ws-api.herokuapp.com';
//const host = 'quiet-sands-19521-ws-api.herokuapp.com';
const PORT = process.env.REACT_APP_WSPORT || 3001;
const wss = new WebSocket(`ws://${host}:${PORT}`);

function App() {


  const [rooms, setRooms] = useState('');
  const [currentRoom, setCurrentRoom] = useState('1');
  const [user, setUser] = useState('');
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
        addMessage(data.messageToSave, data.room);
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
    rooms[currentRoom] && setMessages(rooms[currentRoom].history);
  }, [rooms[currentRoom]]);

  /**
   * Send a username parameter to the WS server
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
  const addMessage = function (message, room) {
    const updatedHistoryInRoom = [...rooms[room].history, message];
    const updatedRoomData = { ...rooms[room], history: updatedHistoryInRoom };
    const updatedRoomsData = { ...rooms, [room]: updatedRoomData };
    setRooms(updatedRoomsData);
    //setMessages((prev) => [...prev, newMessage])
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
      user !== username);
    const updatedRoomData = { ...rooms[room], users: updatedUsersInRoom };
    const updatedRoomsData = { ...rooms, [room]: updatedRoomData };
    setRooms(updatedRoomsData);
  };

  const setActionOnClose = function(username, room) {
  window.onbeforeunload = () => 
    wss.send(JSON.stringify({
      type: 'close',
      data: { userLeft: username, room }}));
  
  }

  const initiateChat = function(username, roomsData) {
    setUser(username);
    localStorage.setItem('user', username);
    setRooms(roomsData);
    const roomToSet = localStorage.getItem('room') || '1' ;
    localStorage.setItem('room', roomToSet);
    setCurrentRoom(roomToSet);
    createUsersObject(roomsData[roomToSet].users);
    setMessages(roomsData[roomToSet].history);
    setActionOnClose(username, roomToSet);
  };

  const switchRoom = function (roomNumber) {
    
    wss.send(JSON.stringify({
      type: 'userSwitch',
      data: { userSwitch: user, oldRoom: currentRoom, newRoom: roomNumber }
    }));
    localStorage.setItem('room', roomNumber);
    setCurrentRoom(roomNumber);
    setActionOnClose(user, roomNumber);
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
  window.onload = () => {
    if (localStorage.getItem('user')) {
      const username = localStorage.getItem('user');
      const room = localStorage.getItem('room');
      //new Promise(
        if (wss.readyState === 1){
          wss.send(JSON.stringify({
            type: 'returningUser',
            data: { username, room },
          }))//)
        }
    }
  }

  return (
    <div className="App">
      {!user && !localStorage.getItem('user') && (
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
