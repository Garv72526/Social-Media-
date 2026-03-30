/*What apiCalls.jsx Is Responsible For

This file handles:

✅ Talking to backend
✅ Sending HTTP requests
✅ Receiving response
✅ Dispatching actions
Login.jsx says:

“Hey apiCalls, please log this user in.”

apiCalls.jsx says:

“Okay. I will talk to backend and update global state.”*/

import axios from "axios"
export const loginCall =async(userCredential,dispatch)=>{
    //dispatch tells which function to run sends action
    //User → Component → dispatch(action) → Reducer → New State → Context → UI updates
    dispatch({type:"LOGIN_START"});
    try{
        const res=await axios.post("/api/auth/login",userCredential);
        dispatch({type:"LOGIN_SUCCESS",payload:res.data})
    }
    catch(err){
        dispatch({type:"LOGIN_FAILURE",payload:err})
    }
}