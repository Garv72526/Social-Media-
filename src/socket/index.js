// This file creates a real-time server that:
// tracks connected users
// updates everyone when users connect/disconnect

//start a real time server
const io =require("socket.io")(8900,{
    cors:{
        origin:"http://localhost:5173"
    }
})

//as socket id keeps changing on every connect  to keep track of all connected users
let users=[]

//so that we dont add same user again and again
const addUser=(userId,socketId)=>{
    //.some->Returns true if user already exists
    !users.some(user=>user.userId===userId) &&
    users.push({userId,socketId})
}

const removeUser=(socketId)=>{
    users=users.filter(user=>user.socketId!==socketId)
}

const getUser=(userId)=>{
    //.find loops through array and for each item(user) chekcs condition
    return users.find(user=>user.userId===userId)
}

//.on->listen for an event "When a new user connects → run this code"
io.on("connection",(socket)=>{
    console.log("a user connectred");
    socket.on("addUser",userId=>{//Wait for frontend(socket.emit("addUser", user._id))
    addUser(userId,socket.id);//store user
    io.emit("getUsers",users)//send to all users
})

//send and get message 
//socket.on to take something from client
socket.on("sendMessage",({senderId,receiverId,text})=>{
        const user=getUser(receiverId)
        //When a user is offline, they're not in the users array
        if (user) {
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
        });
    }
})



//Built-in event → fires when user leaves
socket.on("disconnect",()=>{
    console.log("a user disconnected")
    removeUser(socket.id)
    io.emit("getUsers",users)//Update everyone
    })

})

//SOCKET =one connected user CONTAINS-
// socket.id        // unique ID
// socket.emit()    // send event to this user
// socket.on()      // listen for events from this user
// socket.broadcast // send to others