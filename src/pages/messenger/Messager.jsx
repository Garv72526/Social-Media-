import React, { useEffect } from 'react'
import "./messenger.css"
import Topbar from '../../components/topbar/Topbar'
import Conversation from '../../components/conversations/Conversation'
import Message from '../../components/message/Message'
import ChatOnline from '../../components/chatOnline/chatOnline'
import { AuthContext } from '../../context/AuthContext'
import axios from "axios"
import { useState,useContext,useRef } from 'react'
import {io} from "socket.io-client"


function Messager() {
  // State to store all conversations of the logged-in user
  const [conversations,setConversation] =useState([])
  const [currentChat,setCurrentChat] =useState(null)
  const [messages,setMessages] =useState([])
  const [newMessage,setNewMessage]=useState("");
  const [arrivalMessage,setArrivalMessage]=useState(null);
  const [onlineUsers,setOnlineUsers]=useState([])
  const{user}=useContext(AuthContext)
  //useRef gives you a way to directly access or store something without causing re-renders
   const scrollRef=useRef();  //It points to a DOM element (usually last message)
   const socket=useRef();//store socket 
 
 //SOCKEt-
// Creating a socket connection
// Storing it safely
// Sending your user ID to server
// Listening for online users

//create connection
  useEffect(()=>{
    //socket.current → will hold the connection
    socket.current=io("http://localhost:8900")    
    //     Component loads
    //         ↓
    // Connect to socket server (port 8900)
    //         ↓
    // socket.current now holds connection

    //store arrived data
    socket.current.on("getMessage",data=>{
      setArrivalMessage({
        sender:data.senderId,
        text:data.text,
        createdAt:Date.now(),
      })
    })
  },[])

//update chat if If message belongs to current chat:   → add it to messages
  useEffect(()=>{
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && 
    setMessages((prev)=>[...prev,arrivalMessage])
  },[arrivalMessage,currentChat])


  //to identify user
  useEffect(()=>{

    socket.current.emit("addUser",user._id)//send to server
    socket.current.on("getUsers",users=>{//get users from server
    setOnlineUsers(users.map(u => u.userId))
    })
  },[user])
  


  useEffect(()=>{
    const getConversations=async()=>{
      try{
        const res=await axios.get("/api/conversations/"+user._id)
        setConversation(res.data);
      }
      catch(err){
        console.log(err);
      }
    }
    getConversations();
  },[user._id])
  
  useEffect(()=>{
    const getMessages=async()=>{
      try{
        const res=await axios.get("/api/messages/"+currentChat?._id);
        setMessages(res.data)
      }catch(err){
        console.log(err);
      }
    }
    getMessages();
  },[currentChat])

 
  //Automatically scrolls to the latest message whenever messages change
  //runs every time new message is added
  useEffect(()=>{
    //scrollRef.current👉 Ref gives access to real DOM elemen
    //scrollIntoView()->Scrolls the page to that element
    scrollRef.current?.scrollIntoView({behavior:"smooth"})
  },[messages])


  const handleSubmit=async (e)=>{
    e.preventDefault();//Stops page refresh (important for forms)
    const message={
      sender:user._id,
      text:newMessage,
      conversationId:currentChat._id
    }
    const receiverId=currentChat.members.find(member=>member !==user._id)
    socket.current.emit("sendMessage",{
      senderId:user._id,
      receiverId:receiverId,
      text:newMessage
    })

    try{
      const res=await axios.post("/api/messages/",message)
      setMessages([...messages,res.data])//take old msg andd add new at end
      setNewMessage("")
    }
    catch(err){
      console.log(err);
    }
  }


  return (
    <>
    <Topbar/>
    <div className="messenger">
      <div className="chatMenu">
        <div className="chatMenuWrapper">
          <input placeholder='search for friends' className="chatMenuInput"></input>
          {/* 
              Loop through all conversations

              conversations = array

              For each conversation:
              → render Conversation component
            */}
          {
            conversations.map((c)=>{
              return( 
              <div key={c._id} onClick={()=>{
                setCurrentChat(c);
              }}>
                  <Conversation conversation={c} currentUser={user}  />
                
              </div>)
            })
          }
          
        </div>
      </div>
      <div className="chatBox">
        <div className="chatBoxWrapper">
         { 
            currentChat?
          <>
          <div className="chatBoxTop">
            {
              messages.map((m)=>{
              return  <div ref={scrollRef} key={m._id}>
                <Message message={m} own={m.sender===user._id} />
                </div>
              })
            }
            
          </div>
          <div className="chatBoxBottom">
            <textarea className="chatMessageInput" placeholder='write something..' 
            /*
    Runs every time user types

    e.target.value = current text inside textarea

    setNewMessage(...) updates React state

    Example:
      User types "Hi"
      → newMessage = "Hi"
  */
 
            onChange={(e)=>setNewMessage(e.target.value)}        
            /*
    This makes it a CONTROLLED COMPONENT(value)

    The textarea value is controlled by React state
    The text inside the textarea comes from React state
    UI ↔ State are always in sync
  */value={newMessage} ></textarea>
            <button className='chatSubmitButton' onClick={handleSubmit}>send</button>
          </div>
          </>: <span className="noConversation">  Open a convo to chat</span>}
        </div>
      </div>
      <div className="chatOnline">
        <div className="chatOnlineWrapper">
          <ChatOnline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat}/>
        </div>
      </div>
    </div>
  
  </>
  )
}

export default Messager