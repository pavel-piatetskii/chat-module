import './index.scss';
import MessageFeed from "./MessageFeed";
import UserList from "./UserList";
import RoomList from "./RoomList";

function App() {
  return (
    <div className="App">
      <h1>Hello!</h1>
      <UserList />
      <MessageFeed />
      <RoomList />
    </div>
  );
}

export default App;
