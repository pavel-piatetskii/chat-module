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
  //const [currentRoom, setCurrentRoom] = useState('1');
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
        console.log('init handler');
        let { username, roomsData } = data;
        setUser(username);
        //localStorage.setItem('username', username);
        setRooms(roomsData);
        setCurrentRoom('1');
        //localStorage.setItem('currentRoom', '1');
        createUsersObject(roomsData['1'].users);
        setMessages(roomsData['1'].history);
        break;

      case 'userExist':
        console.log('User exist');
        setExistsMessage(true);
        break;

      case 'newMessage':
        addMessage({
          id: messages.length,
          time: new Date(),
          message: data.newMessage,
          sender: data.sender
        });

    case 'newUser':
      let { newUserRoom, newUserName } = data;
      const updatedUsersInRoom = [...rooms[newUserRoom].users, newUserName];
      const updatedRoomData = { ...rooms[newUserRoom], users: updatedUsersInRoom };
      const updatedRoomsData = { ...rooms, [newUserRoom]: updatedRoomData };
      console.log(updatedRoomsData)
      setRooms(updatedRoomsData);
    }
    //}
  }

  useEffect(() => {
    rooms[currentRoom] && createUsersObject(rooms[currentRoom].users);
  //console.log('rooms[currentRoom]');
  //console.log(rooms[currentRoom]);
  }, [rooms[currentRoom]])

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






  const switchRoom = function (roomNumber) {
    wss.send(JSON.stringify({ type: 'userClosed', data: user }));
    wss.close();
    //setWSS(prev => '');
    localStorage.setItem('username', '');
    setCurrentRoom(roomNumber);
    localStorage.setItem('currentRoom', roomNumber);
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
        <RoomList rooms={rooms} currentRoom={currentRoom} changeRoom={switchRoom} />
      </div>}
    </div>
  );
}

export default App;
