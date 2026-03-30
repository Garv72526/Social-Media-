//The Context API in React is used to share data globally between components without passing props manually at every level.(avoid prop drilling)
//Stores global state and gives it to components.
import { createContext, useReducer,useEffect } from "react"
import AuthReducer from "./AuthReducer";
// This is the default state for authentication
const INITIAL_STATE = {
  user:JSON.parse(localStorage.getItem("user")) || null,
  isFetching: false, // Not loading initially
  error: false       // No error initially
};


//STEps-1)Dispatch Action(example user clicks login button the details go to reducer like email pass) 2)Reducer (decides which property to update)
/*
createContext creates a global container.

We pass INITIAL_STATE as default value.
This value is used only if no Provider exists.
*/
export const AuthContext =createContext(INITIAL_STATE)

export const AuthContextProvider=({children})=>{
    /*
Reducer function controls how state changes.
it Updates Initial state to new state
It takes:
- current state
- action object

Returns:
- new updated state
- state (current state)
- dispatch (function to update state)(internal function)
*/
    const [state,dispatch]=useReducer(AuthReducer,INITIAL_STATE)
    // ✅ This is the missing piece - saves updated user to localStorage
    // whenever state.user changes (login, follow, unfollow, update profile etc.)
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.user))
    }, [state.user])


    return (/*
    Provider makes state available globally
    */
        <AuthContext.Provider value={{
            user:state.user , 
            isFetching:state.isFetching,
            error:state.error,
            dispatch// very important so components can update state
            }} >
                {children}{/* Render all child components */}
        </AuthContext.Provider>
    )
};