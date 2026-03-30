const mongoose=require("mongoose")
const { Profiler } = require("react")

const ConversationSchema = new mongoose.Schema({
   members:{
    type:Array,
   }
},
{timestamps:true}

)

module.exports=mongoose.model("Conversation",ConversationSchema)