import React from 'react';
import "./RoomList.scss";


export default function RoomList(props) {

  const { rooms, changeRoom } = props;

  return (
    <section className="room-list list-section">
      <h2 className="room-list__header">Rooms</h2>
      <div className="room-list__rooms">
        {Object.values(rooms).map((room) => (
          <article
            className="room-list__rooms__room"
            key={room.id}
            onClick={() => changeRoom(room.id)}
          >
            <img className="room-list__rooms__room__image" src={room.image}></img>
            <mark className="room-list__rooms__room__name">{room.name}</mark>
          </article>
        )) }
      </div>
    </section>
  );
};