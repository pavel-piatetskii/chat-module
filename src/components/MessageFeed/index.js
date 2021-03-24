import React, { useRef, useState } from 'react';
import "./MessageFeed.scss"

export default function MessageFeed(props) {

  const { wss, user, sendMessage, messages } = props;

  
  // Implement useRef to scroll down to every new message in the feed
  const messagesScroll = useRef(null);
  const scrollToLast = () => {
    const el = messagesScroll.current;
    el.scrollTop = el.scrollHeight;
  }

  // Action when client opens a websocket connection
  wss.onopen = (e) => {
    console.log('open connection')
    //setMessages(prev => '');
    //const userSaved = localStorage.getItem('username');
    //console.log(userSaved);
    //if (!userSaved) {
    //  wss.send(JSON.stringify({ type: 'newUser', data: user }));
    //  localStorage.setItem('username', user);
    //} else {
    //  wss.send(JSON.stringify({ type: 'foo', data: 'bar' }));
    //}
    //wss.send(JSON.stringify({ type: 'newUser', data: user }));
    //localStorage.setItem('username', user);

  }

  // Action when client receives message
  //wss.onmessage = (rep) => {
  //  console.log(rep.data)
  //  const { type, data } = JSON.parse(rep.data);
  //  switch (type) {
  //    case 'history':
  //      data.map(element => {
  //        const { id, message, time, sender } = element;
  //        addMessage({ id, time: new Date(time), message, sender })
  //      });
  //      break;
  //    case 'newMessage':
  //      addMessage({
  //        id: messages.length,
  //        time: new Date(),
  //        message: data.newMessage,
  //        sender: data.sender
  //      });
  //      scrollToLast(); 
  //      break;
  //    case 'users':
  //      createUsersObject(data);
  //    }
  //    // Call scrolling function on every new message or on history load
  //    scrollToLast(); 
//
  //}

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