import React from 'react';
import "./MessageFeed.scss"

export default function MessageFeed(props) {
  return (
    <section className="message-feed">
      <h2 className="message-feed__header">Room 1</h2>
      {props.messages.map((message) => (
          <article className="message-feed__message">
            <mark className="message-feed__message__time">{message.time.toLocaleString('en-US').split(',')[1]}</mark>
            <p className="message-feed__message__content">{message.message}</p>
          </article>
        )) }
    </section>
  )
}