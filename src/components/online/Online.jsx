import React from 'react'
import "./online.css"
function Online({user}) {
    const PF = import.meta.env.VITE_PUBLIC_FOLDER;

  return (
    <div>
        <li className='rightbarFriend'>
            <div className="rightbarProfileImgContainer">
              <img src={PF+user.profilePicture} alt="" className="rightbarProfileImg" />
              <span className='rightbarOnline'></span>
            </div>
            <span className='rightbarUsername'>{user.username}</span>
        </li>
    </div>
  )
}

export default Online