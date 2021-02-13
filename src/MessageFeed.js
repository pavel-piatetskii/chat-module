import React, { useState } from 'react';
import "./MessageFeed.scss"

const wss = new WebSocket("ws://192.168.1.163:3001");


export default function MessageFeed(props) {

  const [messages, setMessages] = useState('');
  const addMessage = function (newMessage) {
    setMessages((prev) => [...prev, newMessage])
  }

  wss.onopen = (e) => {
    wss.onmessage = (rep) => {
      console.log(JSON.parse(rep.data))
      const { history } = JSON.parse(rep.data)
      history.map(element => {
        const { message, time } = element;
        addMessage({ message, time })
      })     
    }
  }


  wss.onmessage = (rep) => {
    console.log(rep.data)
    addMessage({time: new Date(), message: rep.data})    
  }

  wss.onclose = (e) => {
    console.log('close')
  }

  const [newMessage, setNewMessage] = useState('');
  const sendMessage = function (newMessage) {
    //props.onSend({time: new Date(), message: newMessage})
    wss.send(newMessage)
    setNewMessage('')
  }

  return (
    <section className="message-feed">
      <h2 className="message-feed__header">Room 1</h2>
      {messages && messages.map((message) => (
          <article className="message-feed__message" key={message.length}>
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