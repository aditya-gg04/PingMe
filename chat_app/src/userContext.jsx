import { createContext, useEffect, useState } from "react";
import axios from "axios"
export const userContext=createContext({});

export function UserContextProvider({children}){
    const [username,setUsername]=useState(null);
    const [firstName,setFirstName]=useState(null);
    const [lastName,setLastName]=useState(null);

    useEffect(()=>{
        // axios.get('https://pingme-5dgj.onrender.com/profile').then(response=>{
        axios.get('http://localhost:3000/profile').then(response=>{

            setUsername(response.data.username);
            setFirstName(response.data.firstName);
            setLastName(response.data.lastName);
        })
    },[])

    return (
        <userContext.Provider value={{setUsername,username}}>{children}</userContext.Provider>
    )
}