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
  ]
};


function App() {

  const [messages, setMessages] = useState(data.messages);

  const url = "ws://localhost:3000"
  let wss = new WebSocket(url);

  console.log(wss)

  const addMessage = function (newMessage) {
    setMessages((prev) => [...prev, newMessage])
    //wss.send('Message sent')
    console.log(wss)
  }


  return (
    <div className="App">
      <h1>Hello!</h1>
      <div className="main">
        <UserList users={data.users}/>
        <MessageFeed users={data.users} messages={messages} onSend={addMessage} />
        <RoomList />
      </div>
    </div>
  );
}

export default App;
