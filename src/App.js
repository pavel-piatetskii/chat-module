import { useState, useEffect, Fragment } from "react"
import MessageFeed from "components/MessageFeed";
import UserList from "components/UserList";
import RoomList from "components/RoomList";
import GetUserName from "components/GetUserName";
import 'styles/responsive.scss'


const host = window.location.hostname;
const PORT = process.env.REACT_APP_WSPORT || 80;
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
    setRooms(roomsData);
    setCurrentRoom('1');
    createUsersObject(roomsData['1'].users);
    setMessages(roomsData['1'].history);
    setActionOnClose(username, '1');
  };

  const switchRoom = function (roomNumber) {
    
    wss.send(JSON.stringify({
      type: 'userSwitch',
      data: { userSwitch: user, oldRoom: currentRoom, newRoom: roomNumber }
    }));
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
