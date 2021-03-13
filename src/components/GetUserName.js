import React, { useState } from 'react';
import "./GetUserName.scss";

export default function GetUserName(props) {

  const { saveUser } = props;
  const [username, setUsername] = useState('');

  return (
    <section className="get-user">
      <h1 className="get-user__greeting">Hi! Looks like you're new here! What's your name?</h1>
      <form
        className="get-user__form"
        onSubmit={event => event.preventDefault()}
      >
        <input
          className="get-user__form__input"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <button
          className="get-user__form__button"
          onClick={(() => saveUser(username))}
        >
          That's my name!</button>
      </form>
    </section>
  );
};