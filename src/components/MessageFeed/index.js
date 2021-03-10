import React, { useState } from 'react';
import "./MessageFeed.scss"

export default function MessageFeed(props) {

  const { wss, user, createUsersObject } = props;

  const [messages, setMessages] = useState('');
  const addMessage = function (newMessage) {
    setMessages((prev) => [...prev, newMessage])
  }

  // Action when client opens a websocket connection
  wss.onopen = (e) => {
    setMessages(prev => '')

    wss.send(JSON.stringify({ type: 'newUser', data: user }))

    wss.onmessage = (rep) => {
      const { history } = JSON.parse(rep.data)
      history && history.map(element => {
        const { id, message, time } = element;
        addMessage({ id, time: new Date(time), message })
      })     
    }
  }

  // Action when client receives message
  wss.onmessage = (rep) => {
    const { type, data } = JSON.parse(rep.data);
    switch (type) {
      case 'newMessage':
        addMessage({
          id: messages.length,
          time: new Date(),
          message: data
        });
        break;
      case 'users':
        createUsersObject(data);
    }
  }

  // Action on closing connection
  wss.onclose = (e) => {
    console.log('close')
  }

  const [newMessage, setNewMessage] = useState('');
  const sendMessage = function (newMessage) {
    wss.send(JSON.stringify({ type: 'newMessage', data: newMessage }))
    setNewMessage('')
  }

  return (
    <section className="message-feed">
      <h2 className="message-feed__header">{props.roomName}</h2>
      {messages && messages.map((message) => (
          <article className="message-feed__message" key={message.id}>
            <mark className="message-feed__message__time">{message.time.toLocaleString('en-US').split(',')[1]}</mark>
            <p className="message-feed__message__content">{message.message}</p>
          </article>
        )) }
      <form
        className="message-feed__form"
        onSubmit={event => event.preventDefault()}
        autoComplete='off'
      >
        <input
          className="message-feed__form__input"
          name="new-message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        ></input>
        <button
          className="message-feed__form__button"
          onClick={(() => sendMessage(newMessage))}
        >
          Send</button>
      </form>
    </section>
  )
}