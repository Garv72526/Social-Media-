import React from 'react'
import "./message.css"
import {format} from "timeago.js"
// 'own' is a prop passed to this component
// It tells whether the message is sent by the current user
function Message({ message,own }) {

  return (
    <>
      {/* 
        If 'own' is true:
          className = "message own"
        If 'own' is false:
          className = "message"

        👉 This is called conditional class rendering
      */}
      <div className={own ? "message own" : "message"}>

        <div className="messageTop">
          
          {/* Profile image */}
          <img
            className="messageImg"
            src="/assets/person/2.jpeg"
            alt=""
          />

          {/* Message text */}
          <p className="messageText">
            {message.text}
          </p>
        </div>

        {/* Message time */}
        <div className="messageBottom">{format(message.createdAt)}</div>
      </div>
    </>
  )
}

export default Message