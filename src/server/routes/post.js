const router=require("express").Router();
const Post=require("../models/Post")
const User=require("../models/User")

//create a post
 router.post("/",async (req,res)=>{
    const newPost=new Post(req.body)//same as assigning individually
    try{
        const savedPost= await newPost.save();
        res.status(200).json(savedPost);
    }
    catch(err){
        res.status(500).json(err)
    }
 })

 //update post
router.put("/:id",async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
        if(post.userId==req.body.userId){
            await post.updateOne({
                $set:req.body
            })
            res.status(200).json("the post has been updated")
    }else{
        res.status(403).json("cant update post other user post")
    }
}
    catch(err){
        res.status(500).json(err);
    }
})

//delete a post
router.delete("/:id",async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
        if(post.userId==req.body.userId){
            await post.deleteOne();
            res.status(200).json("the post has been deleted")
    }else{
        res.status(403).json("cant delete post other user post")
    }
}
    catch(err){
        res.status(500).json(err);
    }
})

//like a post
router.put("/:id/likes",async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({
                $push:{
                    likes:req.body.userId
                }
            })
            res.status(200).json("the post has been liked")
        }else{
            await post.updateOne({
                $pull:{
                    likes:req.body.userId
                }
            })
            res.status(200).json("the post has been disliked")
        }
    }
    catch(err){
        res.status(500).json(err);
    }
})

//get timelime posts Show my posts + posts of people I follow.
router.get("/timeline/:userId",async (req,res)=>{
    try{
        const currentUser=await User.findById(req.params.userId)
        const userPosts=await Post.find({userId:currentUser._id})
        const friendPosts=await Promise.all(
            //map is to loop through array .map() automatically passes each value of array into the function .(friendid='A' the ='B'..)
            currentUser.following.map((friendId)=>{
                return Post.find({
                    userId:friendId
                })//returns promise so that is why we use promise.all(it waits for promise to finish) to get posts instead of promise
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts))
        
    }
    catch(err){
        res.status(500).json(err);
    }
})

//get all user's post
router.get("/profile/:username",async (req,res)=>{
    try{
        const user=await User.findOne({username:req.params.username})
         const posts= await Post.find({userId:user._id})
         res.status(200).json(posts)
    }
    catch(err){
        res.status(500).json(err);
    }
})

//get post
router.get("/:id",async (req,res)=>{
    try{
        const post =await Post.findById(req.params.id)
        res.status(200).json(post);

    }    
    catch(err){
        res.status(500).json(err)
    }    
})    

module.exports=router