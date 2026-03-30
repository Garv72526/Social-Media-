//reducer takes state and action and return a new updated state
// AuthReducer is a function
// It receives 2 things:
// 1. state → current state
// 2. action → what happened (LOGIN_START, LOGIN_SUCCESS, etc.)
const AuthReducer =(state,action)=>{

    // switch checks action.type
    // and decides what to do
    switch(action.type){
        case "LOGIN_START":
        return {
            user:null,
            isFetching:true,
            error:false
        };
        case "LOGIN_SUCCESS":
        return {
            // Save logged-in user data
            // action.payload contains user info
            user:action.payload,
            isFetching:false,
            error:false
        };
        case "LOGIN_FAILURE":
        return {
            user:null,
            isFetching:false,
            // Save error message
            error:action.payload
        };
         case "FOLLOW":
  return {
    ...state, 
    // Keep all existing properties in the current state

    user: {
      ...state.user, 
      // Keep all existing user data (username, email, etc.)

      following: [
        ...state.user.following, 
        // Copy the current list of users the person is following

        action.payload 
        // Add the new user ID (the user that was just followed)
      ]
    }
  };


case "UNFOLLOW":
  return {
    ...state, 
    // Keep all existing properties in the current state

    user: {
      ...state.user, 
      // Keep all existing user data

      following: state.user.following.filter(
        (following) => following !== action.payload
        // Remove the user ID from the following list
        // Only keep IDs that are NOT equal to action.payload
      )
    }
  };

        default:
        // Return current state unchanged
        return state
    }
}


export default AuthReducer;