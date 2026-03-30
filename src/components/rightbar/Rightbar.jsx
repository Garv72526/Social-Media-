import React, { useContext, useEffect, useState } from 'react'
import "./rightbar.css"
import { Users } from '../../dummyData'
import Online from '../online/Online'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { Add, Remove } from '@mui/icons-material'
import axios from 'axios'
import { NotificationContext } from '../../context/NotificationContext' // 🔔 CHANGE: import notification context

function Rightbar({user}) {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([])
  const { user: currentUser, dispatch } = useContext(AuthContext)
  const [followed, setFollowed] = useState(false)

  // 🔔 CHANGE: get addNotification function from context to fire notification on follow
  const { addNotification } = useContext(NotificationContext);

  useEffect(() => { 
    if (user) { 
      setFollowed(currentUser.following.includes(user._id))
    }
  }, [user, currentUser.following]) 

  useEffect(() => {
    const getFriends = async () => {
      try {
        if (!user?._id) return 
        const friendList = await axios.get("/api/users/friends/" + user._id)
        setFriends(friendList.data)
      } catch(err) {
        console.log(err)
      }
    }
    getFriends();
  }, [user?._id]) 

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put("/api/users/" + user._id + "/unfollow", { userId: currentUser._id })
        dispatch({ type: "UNFOLLOW", payload: user._id })
      } else {
        await axios.put("/api/users/" + user._id + "/follow", { userId: currentUser._id })
        dispatch({ type: "FOLLOW", payload: user._id })
        // 🔔 CHANGE: add a notification when user follows someone
        addNotification({ text: `You followed ${user.username}` });
      }
      setFollowed(!followed)
    } catch(err) {
      console.log("Error response:", err.response?.data)
    }
}

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img src={PF + "gift.png"} alt="" className="birthdayImg" />
          <span className="birthdayText">
            <b>pola foster</b> and <b>3 other</b> have birthday today
          </span>
        </div>
        <img className='rightbarAd' src={PF + 'ad.png'} alt="" />
        <h4 className="rightbarTitle">online friends</h4>
        <ul className='rightbarFriendList'>
          {Users.map(u => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    )
  }

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && ( 
          <button className="rightbarFollowingButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className='rightbarTitle'>User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationships:</span>
            <span className="rightbarInfoValue">{user.relationship}</span>
          </div>
        </div>
        <h4 className='rightbarTitle'>User Friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link key={friend._id} to={"/profile/" + friend.username}>
              <div className="rightbarFollowing">
                <img
                  src={friend.profilePicture ? PF + friend.profilePicture : PF + "person/3.jpeg"} 
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span> 
              </div>
            </Link>
          ))}
        </div>
      </>
    )
  }

  return (
    <div className='rightbar'>
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  )
}

export default Rightbar