import React, { useContext, useRef } from 'react'
import "./share.css"
import {PermMedia,Label,Room,EmojiEmotions, Cancel, SignalCellularNull} from "@mui/icons-material"
import {AuthContext} from "../../context/AuthContext"
import { useState } from 'react'
import axios from "axios"
function Share() {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const {user} =useContext(AuthContext)
  const desc= useRef();
  const [file,setFile]=useState(null);
  // function runs when the form is submitted
const submitHandler = async (e) => {

  // prevent page refresh after form submit
  e.preventDefault();

  // create a new post object to send to backend
  const newPost = {
    userId: user._id,                 // id of the logged-in user
    desc: desc.current.value          // text description entered by user
  };

  // check if user selected an image/file
  if (file) {

    // FormData is used to send files in HTTP requests
    const data = new FormData();

    // create a unique file name using timestamp
    const fileName =file.name;

    // append the actual file
    // "file" must match upload.single("file") in backend
    data.append("file", file);

    // append the filename so backend knows how to save it
    data.append("name", fileName);

    // add image name to the post object so it can be stored in database
    newPost.img = fileName;

    try {

      // send file to backend upload route
      await axios.post("/api/upload", data);
    } catch (err) {
      
      // log error if upload fails
      console.log(err);
      
    }
  }
  
  try {
    
    // send post data (text + image name) to backend
    await axios.post("/api/posts", newPost);
    window.location.reload();//After creating the post, refresh the feed:

  } catch (err) {

    // log error if post creation fails
    console.log(err);

  }
};

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img className="shareProfileImg" src={user.profilePicture?PF+user.profilePicture:PF+"/person/8.jpeg"} alt="" />
          <input
            placeholder={"What's in your mind "+user.username+"?"}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr"/>
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            <Cancel className='shareCancelImg' onClick={()=>{setFile(SignalCellularNull)}}/> 
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
            <div className="shareOptions">
                <label htmlFor="file" className="shareOption">{/*<label> acts as the button ,htmlFor="file" connects the label to the input.*/}
                    <PermMedia htmlColor="tomato" className="shareIcon"/>
                    <span className="shareOptionText">Photo or Video</span>
                    <input type="file" style={{display:"none"}}  id="file" accept=".png,.jpeg,.jpg" onChange={(e)=>setFile(e.target.files[0])}/>{/*to upload only one file */}
                </label>
                <div className="shareOption">
                    <Label htmlColor="blue" className="shareIcon"/>
                    <span className="shareOptionText">Tag</span>
                </div>
                <div className="shareOption">
                    <Room htmlColor="green" className="shareIcon"/>
                    <span className="shareOptionText">Location</span>
                </div>
                <div className="shareOption">
                    <EmojiEmotions htmlColor="goldenrod" className="shareIcon"/>
                    <span className="shareOptionText">Feelings</span>
                </div>
            </div>
            <button className="shareButton">Share</button>
        </form>
      </div>
    </div>

  )
}

export default Share