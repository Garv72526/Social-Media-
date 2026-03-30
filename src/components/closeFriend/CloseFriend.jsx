import React from 'react'
import "./closeFriend.css"
function CloseFriend({user}) {
    const PF = import.meta.env.VITE_PUBLIC_FOLDER;

  return (
    <div>
        <li className='sidebarFriend'>
            <img className='sidebarFriendImg' src={PF+user.profilePicture}></img>
            <span className="sidebarFriendName">{user.username}</span>
        </li>
    </div>
  )
}

export default CloseFriend