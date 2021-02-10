import MessageFeed from "./MessageFeed";
import UserList from "./UserList";
import RoomList from "./RoomList";

const data = {
  users: {
    '1': { id: 1, name: 'Jake', avatar: 'https://avatars.dicebear.com/4.5/api/gridy/1.svg' },
    '2': { id: 2, name: 'Jane', avatar: 'https://avatars.dicebear.com/4.5/api/gridy/2.svg' }
  },
  messages: [
    { id: 1, room: 1, sender: 1, message: 'Hi!' },
    { id: 2, room: 1, sender: 2, message: 'Hello! How\'r U?' },
    { id: 3, room: 1, sender: 1, message: 'Good :)!' }
  ]
};

function App() {
  return (
    <div className="App">
      <h1>Hello!</h1>
      <div className="main">
        <UserList users={data.users}/>
        <MessageFeed />
        <RoomList />
      </div>
    </div>
  );
}

export default App;
