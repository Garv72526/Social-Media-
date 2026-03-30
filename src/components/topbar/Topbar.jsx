import React, { useContext, useState } from 'react' // 🔔 CHANGE: added useState
import "./topbar.css"
import{Person, Search,Chat ,Notifications} from "@mui/icons-material"
import {Link}from "react-router-dom"
import { AuthContext } from '../../context/AuthContext'
import { NotificationContext } from '../../context/NotificationContext' // 🔔 CHANGE: import notification context

function Topbar() {
const {user}=useContext(AuthContext);
const PF = import.meta.env.VITE_PUBLIC_FOLDER;

// 🔔 CHANGE: get notifications list and a function to clear them from context
const { notifications, clearNotifications } = useContext(NotificationContext);

// 🔔 CHANGE: toggle dropdown open/close when bell is clicked
const [showDropdown, setShowDropdown] = useState(false);

const handleBellClick = () => {
  if (showDropdown) clearNotifications(); // mark as read when opened
  setShowDropdown(!showDropdown);
};

  return (
    <div className="topbarContainer">
        <div className="topbarLeft">
            <Link to="/" style={{textDecoration:"none"}}>
            <span className="logo">Social</span>
            </Link>
        </div>
        <div className="topbarCenter">
            <div className="searchbar">
            <Search className='searchIcon'/>
            <input placeholder="Search for friend, video or post" className="searchInput" />
            </div>
        </div>
        <div className="topbarRight">
        <div className="topbarLinks">
            <span className="topbarLink">HomePage</span>
            <span className="topbarLink">TImeline</span>
        </div>
        <div className="topbarIcons">
            <div className="topbarIconItem">
                <Person/>
                <span className="topbarIconBadge">1</span>
            </div>
            <div className="topbarIconItem">
                <Chat/>
                <span className="topbarIconBadge">1</span>
            </div>

            {/* 🔔 CHANGE: Bell icon now shows real notification count and dropdown */}
            <div className="topbarIconItem" onClick={handleBellClick} style={{cursor:"pointer"}}>
                <Notifications/>
                {/* Only show red badge if there are unread notifications */}
                {notifications.length > 0 && (
                  <span className="topbarIconBadge">{notifications.length}</span>
                )}
                {/* Dropdown list of notifications */}
                {showDropdown && (
                  <div className="notifDropdown">
                    {notifications.length === 0 ? (
                      <span className="notifEmpty">No new notifications</span>
                    ) : (
                      notifications.map((n, i) => (
                        <div key={i} className="notifItem">{n.text}</div>
                      ))
                    )}
                  </div>
                )}
            </div>
        </div>
        <Link to={`/profile/${user.username}`}>
        <img src={user.ProfilePicture ? (PF+"/person/"+user.ProfilePicture):(PF+"/person/10.jpeg")} alt="" className="topbarImg" />
        </Link>
        </div>
    </div>
  )
}

export default Topbar