const router =require("express").Router();
const Conversation =require("../models/Conversation")

//new conv
router.post("/",async (req,res)=>{
const newConversation= new Conversation({
    members:[req.body.senderId,req.body.receiverId]
})
try{
    const savedConversation=await newConversation.save();
    res.status(200).json(savedConversation)
}catch(err){
    res.status(500).json(user);
}
})
//get conv of user

router.get("/:userId",async(req,res)=>{
    try{
        // $in operator:
        //The $in operator always expects an array of values thats why in [userId] brackets.
        //Find conversations where members array contains this userId
        // - Checks if the given value exists inside an array field
        // - Here, it checks if userId exists in "members"
         const conversation=await Conversation.find({
            members:{$in:[req.params.userId]}
        });//$in operator is used to match values inside an array.
        res.status(200).json(conversation)
    }catch(err){
    res.status(500).json(user);
}
})

//get conv includes two userId
router.get("/find/:firstUserId/:secondUserId",async(req,res)=>{
    try{
        const conversation=await Conversation.findOne({
          members:{$all:[req.params.firstUserId,req.params.secondUserId]}
        })// $all = members array must contain BOTH ids

        res.status(200).json(conversation)
        
    }catch(err){
        res.status(500).json(err);
    }
})


module.exports=router;