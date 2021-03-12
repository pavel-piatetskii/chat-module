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
  }

  // Action when client receives message
  wss.onmessage = (rep) => {
    console.log(rep.data)
    const { type, data } = JSON.parse(rep.data);
    switch (type) {
      case 'history':
        data.map(element => {
          const { id, message, time, sender } = element;
          addMessage({ id, time: new Date(time), message, sender })
        });
        break;
      case 'newMessage':
        addMessage({
          id: messages.length,
          time: new Date(),
          message: data.newMessage,
          sender: data.sender
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
    wss.send(JSON.stringify({ type: 'newMessage', data: { sender: user, newMessage } }))
    setNewMessage('')
  }

  return (
    <section className="message-feed">
      <h2 className="message-feed__header">{props.roomName}</h2>
      <div className="message-feed__messages">
      {messages && messages.map((message) => (
          <article className="message-feed__message" key={message.id}>
            <div className="message-feed__message__sender-time">
              <mark className="message-feed__message__sender-time__sender">{message.sender}</mark>
              <mark className="message-feed__message__sender-time__time">{message.time.toLocaleString('en-US').split(',')[1]}</mark>
            </div>
            <p className="message-feed__message__content">{message.message}</p>
          </article>
        )) }
      </div>
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