import { MoreVert } from '@mui/icons-material'
import React, { useState,useEffect, useContext } from 'react'
import "./post.css" 
import { Users } from '../../dummyData'
import axios from "axios"
import {format} from "timeago.js"
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

function Post({post}) {
    const[like ,setLike]=useState(post.likes.length)
    const[isLiked,setIsLiked]=useState(false)
    const[user,setUser]=useState({})
    const PF = import.meta.env.VITE_PUBLIC_FOLDER;
    const {user:currentUser}=useContext(AuthContext)
    
    // 🤖 CHANGE: state for AI caption feature
    const [aiCaption, setAiCaption] = useState(""); // stores the generated caption
    const [loadingCaption, setLoadingCaption] = useState(false); // shows "Generating..." text

    useEffect(()=>{
        setIsLiked(post.likes.includes(currentUser._id))
    },[currentUser._id,post.likes])

    const likeHandler= async () =>{
    try{
    await axios.put("api/posts/"+post._id+"/likes",{userId:currentUser._id} )
    }
    catch(err){}
        setLike(isLiked? like-1 : like+1);
        setIsLiked(!isLiked)
    }

     useEffect(()=>{
        const fetchUser =async ()=>{
          const res =await axios.get(`/api/users?userId=${post.userId}`)
          setUser(res.data)
        }
        fetchUser();
      },[post.userId])

    // 🤖 CHANGE: this function calls your Node.js backend which calls OpenAI
    // Your backend route will be: POST /api/ai/caption  { desc: "post text here" }
    const generateCaption = async () => {
        setLoadingCaption(true);
        setAiCaption(""); // clear old caption before generating new one
        try {
            const res = await axios.post("/api/ai/caption", {
                desc: post.desc // send post text to backend
            });
            setAiCaption(res.data.caption); // show the AI caption
        } catch (err) {
            setAiCaption("Could not generate caption. Try again.");
        }
        setLoadingCaption(false);
    };

  return (
    <div className='post'>
        <div className="postWrapper">
            <div className="postTop">
                <div className='postTopLeft'>
                    <Link to={`profile/${user.username}`}>
                    <img className='postProfileImg' src={user.profilePicture?PF+user.profilePicture : PF +"person/10.jpeg"}></img>
                    </Link>
                    <span className='postUsername'>{user.username}</span>
                    <span className="postDate">{format(post.createdAt)}</span>
                </div>
                <div className='postTopRight'>
                    <MoreVert/>
                </div>
            </div>
            <div className="postCenter">
                <span className="postText">{post?.desc}</span>
                <img src={PF+post.img}className='postImg'></img>
            </div>
            <div className="postBottom">
                <div className="postBottomLeft">
                    <img src={PF+"like.png"} className='likeIcon' onClick={likeHandler}></img>
                    <img src={PF+"heart.png"} className='likeIcon' onClick={likeHandler}></img>
                    <span className="postLikeCounter">{like} people liked it </span>
                </div>
                <div className="postBottomRight">
                    <span className="postCommentText">{post.comment}9 comments</span>
                </div>
            </div>

            {/* 🤖 CHANGE: AI caption section below each post */}
            <div className="postAiSection">
                <button className="postAiButton" onClick={generateCaption} disabled={loadingCaption}>
                    {loadingCaption ? "Generating..." : "✨ Generate AI Caption"}
                </button>
                {/* Show AI result only when it exists */}
                {aiCaption && (
                    <div className="postAiCaption">
                        <strong>AI Caption:</strong> {aiCaption}
                    </div>
                )}
            </div>

        </div>
    </div>
  )
}

export default Post