import { useContext, useState } from 'react'
import axios from "axios"
import './App.css'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Chat from './pages/Chat'
import {BrowserRouter,Routes,Route, Navigate} from 'react-router-dom'
import { userContext } from './userContext'


function App() {
  const [count, setCount] = useState(0)
  axios.defaults.withCredentials=true;
  const {username}= useContext(userContext);
  return (
    <>
    <BrowserRouter>
    
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        {username && <Route path="/chat" element={<Chat />} />}
        <Route path="/" element={<Navigate to="/signup" />} />
        
      </Routes>
      
    </BrowserRouter>
        
    </>
  )
}

export default App
