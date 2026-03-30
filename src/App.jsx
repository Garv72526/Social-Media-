import React from 'react'
import "./App.css"
import Home from './pages/home/home'
import {Person} from "@mui/icons-material"
import Profile from './pages/profile/Profile'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import Messager from './pages/messenger/Messager'
import { BrowserRouter, Routes, Route,Link ,Navigate} from "react-router-dom";
import { AuthContext } from './context/AuthContext'
import { useContext } from 'react'
import { NotificationContextProvider } from './context/NotificationContext' 

function App() {
const{user}=useContext(AuthContext);//This just extracts the user property

  return (
    <NotificationContextProvider>
      <BrowserRouter>
  <Routes>

    {/* Home Route */}
    <Route
      path="/"
      element={user ? <Home /> : <Register />}
    />

    {/* Profile Route */}
    <Route
      path="/profile/:username"
      element={<Profile />}
    />

    {/* Login Route */}
    <Route
      path="/login"
      element={user ? <Navigate to="/" /> : <Login />}
    />

    {/* Register Route */}
    <Route
      path="/register"
      element={user ? <Navigate to="/" /> : <Register />}
    />
    <Route
      path="/messenger"
      element={!user ? <Navigate to="/" /> : < Messager/>}
    />

  </Routes>
</BrowserRouter>
</NotificationContextProvider>
)
}

export default App