const router=require("express").Router()
const User=require("../models/User")
const bcrypt=require("bcrypt");
//Register
router.post("/register",async (req,res)=>{
    try{
        //generate new passwoord
        const salt=await bcrypt.genSalt(10);//randomness which is added to password for hashing
        const hashedPassword =await bcrypt.hash(req.body.password,salt);
        
        //create new user
        const newUser=new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
        })
        //save user and send response 
        const user=await newUser.save();//to write to dB
        res.status(200).send();//successful
    }
    catch(err){
        console.log(err); 
    }
})

//login user
router.post("/login",async (req,res)=>{
try{
    const user = await User.findOne({
      email: req.body.email
    });

    if (!user) {
      return res.status(404).json("User not found");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json("Wrong password");
    }
    res.json(user);
    }
    catch(error){
        console.log(err);
    }

})



module.exports=router 