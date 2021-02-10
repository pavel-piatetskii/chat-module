import React from 'react';
import "./UserList.scss"

export default function UserList(props) {
  return (
    <section className="user-list list-section">
      <h2 className="user-list__header">Users in this room</h2>
      <div className="user-list__users">
        {Object.values(props.users).map((user) => (
          <article className="user-list__users__user" key={user.id}>
            <img className="user-list__users__user__avatar" src={user.avatar}></img>
            <mark className="user-list__users__user__name">{user.name}</mark>
          </article>
        )) }
      </div>
    </section>
  )
}