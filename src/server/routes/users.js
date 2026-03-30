const router=require("express").Router()
const User=require("../models/User")
const bcrypt=require("bcrypt")

//Update a user whose ID is in the URL
router.put("/:id",async (req,res)=>{
    if(req.body.userId== req.params.id || req.body.isAdmin){
        if(req.body.password){//“If the request contains a password field, then hash it.”
            try{
                const salt =await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt) 
            }
            catch(err){
                return res.json(err);
            }
        }
        try{
            // Find user by ID (from URL) and update fields
            const user=await User.findByIdAndUpdate(req.params.id,// ID taken from URL (example: /users/123)              
                {
                    $set:req.body
                }
            );// Update only the fields sent in request body
                // Example: { username: "newName" }
                res.status(200).json("acc has been updated")
        }
        catch(err){
            console.log(err)
        }

    }else{
        return res.status(500).json("you cant update")
    }
})

//delete user
router.delete("/:id",async (req,res)=>{
    if(req.body.userId== req.params.id || req.body.isAdmin){
        try{
                const user=await User.findByIdAndDelete(req.params.id);
                res.status(200).json("acc has been deleted");
        }
        catch(err){
            console.log(err)
        }

    }else{
        return res.status(500).json("you cant update")
    }
})


//get a user from database
router.get("/",async (req,res)=>{
    const userId=req.query.userId;
    const username=req.query.username
    try{
        const user =userId ?await User.findById(userId) : await User.findOne({username:username});//returns full user document with all attributes

        //for not showing sensitive fields
        const{password,updatedAt,...other}=user._doc//user._doc gives the actual raw MongoDB document.
        //put aside password and updatedAt and put everything else inside other like username,email etc
        res.status(200).json(other)
    }
    catch(err){
        res.status(500).json(err);
    }
})

//Logged-in user wants to follow another user.
router.put("/:id/follow",async (req,res)=>{
    if(req.body.userId!=req.params.id){//prevent self follow
        try{
            const user = await User.findById(req.params.id);
            const current =await User.findById(req.body.userId);//user trying to make request
            if(!user.followers.includes(req.body.userId)){//If target user’s followers array does NOT contain current user then allow to follow.
                await user.updateOne(
                    {
                        $push:{followers:req.body.userId}//$push->Add a new value into an array field.
                    }
                )
                await current.updateOne(
                    {
                        $push:{following:req.params.id}
                    }
                )
                res.status(200).json("user has been followed")
            }else{
                res.status(403).json("you already follow this user")
            }
        }
        catch(err){
            res.status(500).json(err);
        }
    }
    else{
        res.status(403).json("cant follow yourself")
    }
})


//unfollow a user
router.put("/:id/unfollow",async (req,res)=>{
    if(req.body.userId!=req.params.id){//prevent self follow
        try{
            const user = await User.findById(req.params.id);
            const current =await User.findById(req.body.userId);//user trying to make request
            if(user.followers.includes(req.body.userId)){//If target user’s followers array does NOT contain current user then allow to follow.
                await user.updateOne(
                    {
                        $pull:{followers:req.body.userId}//$pull->Remove a value from an array field.
                    }
                )
                await current.updateOne(
                    {
                        $pull:{following:req.params.id}
                    }
                )
                res.status(200).json("user has been unfollowed")
            }else{
                res.status(403).json("you already unfollow this user")
            }
        }
        catch(err){
            res.status(500).json(err);
        }
    }
    else{
        res.status(403).json("cant follow yourself")
    }
})

//get friends
router.get("/friends/:userId",async (req,res)=>{
    try{
        const user = await User.findById(req.params.userId)
        const friends =await Promise.all(
            user.following.map(friendId=>{
                return User.findById(friendId)
            })
        )
        let friendList=[]
        friends.map(friend=>{
            const{_id,username,profilePicture} =friend
            friendList.push({_id,username,profilePicture})
        })
        res.status(200).json(friendList)
    }
    catch(err){
        res.status(300).json(err);
    }
})

module.exports=router 