const dotenv = require("dotenv");
dotenv.config();//to use .env file
console.log("KEY:", process.env.OPENAI_API_KEY); // add this line

const cors=require("cors")
const express = require("express");
const app = express();
// Import mongoose -> helps connect and interact with MongoDB
const mongoose = require("mongoose");
// Import dotenv -> loads environment variables from a .env file
// Import helmet -> adds security-related HTTP headers to protect your app
const helmet = require("helmet");
// Import morgan -> logs HTTP requests in the console (useful for debugging)
const morgan = require("morgan");
const userRouter=require("./routes/users");
const authRouter=require("./routes/auth");
const postRouter=require("./routes/post");
const conversationRoute=require("./routes/conversations")
const messageRoute=require("./routes/messages")
const aiRoute=require("./routes/ai")
const sentimentRoute = require("./routes/sentiment");
const multer =require("multer")//Multer is a Node.js middleware used for uploading files.
app.use(cors());

//middleware  
app.use(express.json())//parse jason data from request body
app.use(helmet())
app.use(morgan("common"))

// Configure where and how uploaded files should be stored
const storage = multer.diskStorage({
  // destination = folder where files will be saved
  destination: (req, file, cb) => {
    
    // cb = callback
    // first parameter = error (null means no error)
    // second parameter = folder path
    cb(null, path.join(__dirname, "../public/assets")); // ← absolute path
    
  },
  
  // filename = how the uploaded file should be named
  filename: (req, file, cb) => {
    
    // here we rename the file using the name sent from frontend
    // req.body.name comes from FormData
    cb(null, req.body.name || file.originalname);
    
  }
  
});

// create upload middleware using the storage config
const upload = multer({ storage });

// route to upload a file
app.post("/api/upload", upload.single("file"), (req, res) => {
  
  // upload.single("file")
  // means accept ONE file with field name "file"
  
  try {
    
    // if upload succeeds, send response
    return res.status(200).json("file uploaded done");
    
  } catch (err) {
    
    console.log(err);
    
  }
  
});
mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log("Database connected ");
})
.catch((err) => {
  console.log("Connection failed", err);
});


app.use("/api/users",userRouter); //at this address run this router or rest function
app.use("/api/auth",authRouter);
app.use("/api/posts",postRouter);
app.use("/api/conversations",conversationRoute);
app.use("/api/messages",messageRoute);
app.use("/api/ai",aiRoute)
app.use("/api/sentiment", sentimentRoute);

app.get("/",(req,res)=>{
  res.send("wecome to ohome page")
})

app.listen(5000,()=>{
    console.log("backend server ready")
});