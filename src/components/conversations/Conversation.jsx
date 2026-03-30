import React from 'react'
import "./conversation.css"
import axios from "axios"
import { useState, useEffect } from 'react';

/*
  Props:
  - conversation → contains chat info (including members array)
  - currentUser → logged-in user
*/
function Conversation({ conversation, currentUser }) {

  // Store the friend (other user in conversation)
  const [user, setUser] = useState(null);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;

  /*
    useEffect runs:
    - when component loads
    - when conversation OR currentUser changes
  */
  useEffect(() => {

    /*
      conversation.members example:
      ["user1Id", "user2Id"]

      We need the OTHER user (not current user)

      Example:
      currentUser._id = "A"
      members = ["A", "B"]

      → friendId = "B"
    */
    const friendId = conversation.members.find(
      (m) => m !== currentUser._id
    );

    // Function to fetch friend's data from backend
    const getUser = async () => {
      try {
        // API request to get user by ID
        const res = await axios(
          "/api/users?userId=" + friendId
        );

        // Save fetched user into state
        setUser(res.data);

      } catch (err) {
        console.log(err);
      }
    }

    // Call function
    getUser();

  }, [currentUser, conversation]);

  return (
    <div className='conversation'>
      <img
        className="conversationImg"
        src={user?.profilePicture ? PF+user.profilePicture : PF + "person/7.jpeg"}
        alt=""
      />
      <span className="conversationName">
        {user?.username}
      </span>

    </div>
  )
}

export default Conversation