import React, { useContext, useState } from 'react';
import { Heading } from '../components/Heading';
import { InputBox } from '../components/InputBox';
import { Button } from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userContext } from '../userContext';

const Signin = () => {

  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [error, setError] = useState("");
  const navigate=useNavigate();
  const {setUsername:setLoggedinUsername } =useContext(userContext);
  const handleSignup = async () => {
    try {
      // const response = await axios.post('https://pingme-5dgj.onrender.com/signin', {
      const response = await axios.post('http://localhost:3000/signin', {

        username,
        password
      });
      setLoggedinUsername(username);
      navigate('/chat')
      console.log('User logged in successfully:', response.data);
      
      
    } catch (err) {
      setError(err.response.data.error || 'Signin failed');
      console.error('Error signing in:', err);
    }
  };

    return (
        <div>
            <div className='h-screen bg-slate-300 flex justify-center items-center'>
          <div className='h-1/2 w-96 text-center shadow-md rounded-md bg-white flex  flex-col'>
            <div className='flex justify-center flex-col items-center'>
            <Heading label={"Sign In"}/>
            <div className='p-4 text-slate-500'>Enter you information to create to Log in  </div>
            </div>
           
            <InputBox label={"Email"} place={"aditya@gmail.com"} onChange={(e)=>{
              setUsername(e.target.value)
            }}/>
            <InputBox label={"Password"} place={"Password"} onChange={(e)=>{
              setPassword(e.target.value)
            }}/>
            <Button label={"Sign In"} onClick={handleSignup}/>

            <div>
                Already have an account? <Link to={"/signup"} className=' underline'>Signup</Link>
            </div>
          </div>  
        </div>
        </div>
    );
}

export default Signin;
