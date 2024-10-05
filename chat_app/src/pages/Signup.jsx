import React, { useContext, useState } from 'react';
import { Heading } from '../components/Heading';
import { InputBox } from '../components/InputBox';
import { Button } from '../components/Button';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from "axios"
import { userContext } from '../userContext';



const Signup = () => {
  const [firstname,setFirstname]=useState("");
  const [lastname,setLastname]=useState("");
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [error, setError] = useState("");
  const {setUsername:setLoggedinUsername }=useContext(userContext);
  const navigate =useNavigate();
  const handleSignin = async () => {
    try {
      // const response = await axios.post('https://pingme-5dgj.onrender.com/signup', {
        const response = await axios.post('http://localhost:3000/signup', {

        firstname,
        lastname,
        username,
        password
      });
      setLoggedinUsername(username);
      navigate('/chat')
      console.log('User signed up successfully:', response.data);
      
      
    } catch (err) {
      setError(err.response.data.error || 'Signup failed');
      console.error('Error signing up:', err);
    }
  };

  
    return (
        <div className='h-screen bg-slate-300 flex justify-center items-center'>
          <div className='h-4/6 w-96 text-center shadow-md rounded-md bg-white flex  flex-col'>
            <div className='flex justify-center flex-col items-center'>
            <Heading label={"Sign up"}/>
            <div className='p-4 text-slate-500'>Enter you information to create an account </div>
            </div>
            <InputBox label={"First Name"} place={"Aditya"} onChange={(e)=>{
              setFirstname(e.target.value);
            }}/>
            <InputBox label={"Last Name"} place={"G"} onChange={(e)=>{
              setLastname(e.target.value);
            }}/>
            <InputBox label={"Email"} place={"aditya@gmail.com"} onChange={(e)=>{
              setUsername(e.target.value);
            }}/>
            <InputBox label={"Password"} place={"Password"} onChange={(e)=>{
              setPassword(e.target.value);
            }}/>
            <Button label={"Sign Up"} onClick={handleSignin}/>

            <div>
                Already have an account? <Link to={"/signin"} className=' underline'>Signin</Link>
            </div>
          </div>  
        </div>
    );
}

export default Signup;
