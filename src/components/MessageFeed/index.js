import React, { useEffect, useRef, useState } from 'react';
import "./MessageFeed.scss"

export default function MessageFeed(props) {

  const { wss, user, sendMessage, messages } = props;

  
  // Implement useRef and useEffect to scroll down if a new message is added to the feed
  const messagesScroll = useRef(null);
  const scrollToLast = () => {
    const el = messagesScroll.current;
    el.scrollTop = el.scrollHeight;
  }

  useEffect(() => {
    scrollToLast();
  }, [messages])

  // Action on closing connection
  //wss.onclose = (e) => {
  //  console.log('close')
  //}

  const [newMessage, setNewMessage] = useState('');

  const clickSend = function() {
    sendMessage(newMessage);
    setNewMessage('');
  }

  return (
    <section className="message-feed">
      <h2 className="message-feed__header">{props.roomName}</h2>
      <div ref={messagesScroll} className="message-feed__messages">
      {messages && messages.map((message) => (
          <article className="message-feed__message" key={message.id}>
            <div className="message-feed__message__sender-time">
              <mark className="message-feed__message__sender-time__sender">{message.sender}</mark>
              <mark className="message-feed__message__sender-time__time">
                {new Date(message.time).toLocaleString('en-US').split(',')[1]}
              </mark>
            </div>
            {(user === message.sender) ? <p className="message-feed__message__content my-message">{message.message}</p> :
            <p className="message-feed__message__content">{message.message}</p>
            }
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
          onClick={(() => clickSend())}
        >
          Send</button>
      </form>
    </section>
  )
}