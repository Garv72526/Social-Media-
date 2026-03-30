// This function creates an action for when login starts
// "export" makes this function usable in other files
export const LoginStart=(userCredentials)=>({
    // "type" is just a label.
  // The reducer reads this to know what to do.
  // Here it means: login process has started.
    type:"LOGIN_START"
    // userCredentials is the data you pass into this function
  // Example: { email, password }
  // BUT right now you are NOT using it inside this action.

})

// This function creates an action for successful login
export const LoginSuccess=(user)=>({
    // This tells the reducer:
  // Login worked successfully.
    type:"LOGIN_SUCCESS",


    // "payload" means data you want to send to reducer.
  // Here we send the logged-in user's data.
  // Example: { id: 1, username: "Ravi" }
    payload:user

})

// This function creates an action for failed login
export const LoginFailure=(error)=>({
    // This tells the reducer:
  // Login failed.
    type:"LOGIN_FAILURE",

    // Here we send the error information.
  // Example: "Invalid password"
    payload:error
})


export const Follow=(userId)=>({
  type:"FOLLOW",
  payload:userId
})
export const UnFollow=(userId)=>({
  type:"UNFOLLOW",
  payload:userId
})