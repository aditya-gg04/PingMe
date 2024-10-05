import React, { useContext, useEffect, useRef, useState } from 'react';
import { userContext } from '../userContext';
import Avatar from '../components/Avatar';
import axios from 'axios';


const Chat = () => {
    const { username } = useContext(userContext)
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState([])
    const [offlinePeople, setofflinePeople] = useState([])
    const [selectedusername, setSelectedusername] = useState(null);
    const [textMessage, setTextmessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [flag,setFlag]=useState(true);
    const messageBoxRef = useRef()

    useEffect(() => {
       connectToWs();
    }, [])

    function connectToWs(){
        // const ws = new WebSocket('wss://pingme-5dgj.onrender.com')
        const ws = new WebSocket('ws://localhost:3000')

        setWs(ws);
        ws.addEventListener('message', handlemessage)
        ws.addEventListener('closed',()=>{
            setTimeout(()=>{
                console.log("Re-connecting");
                connectToWs()
            },2000)
        })

       
    }

    const ShowPeopleOnline = (peopleArr) => {
        const combinedSet = new Set([...onlinePeople, ...peopleArr.map(person => JSON.stringify(person))]);
        const uniquePeople = Array.from(combinedSet).map(person => JSON.parse(person));
        setOnlinePeople(uniquePeople);
    };
   
    function handlemessage(ev) {
        try {
            const messageData = JSON.parse(ev.data);

            if ('online' in messageData) {
                ShowPeopleOnline(messageData.online);
                
            } else {
                setMessages(p => ([...p, { ...messageData }]))

            }
        } catch (error) {
            console.error('Error parsing message data:', error);
        }
    }

    function sendMessage(e) {
        e.preventDefault();
        console.log("sending")
        console.log(textMessage);
       if(textMessage==""){
        setFlag(false);
        console.log("enter something")
       }
       else
       {
        setFlag(true);
        ws.send(JSON.stringify({
            message: {
                recipient: selectedusername,
                text: textMessage,
                _id:Date.now()

            }
        }))

        setTextmessage('')
        setMessages(p => ([...p, { sender: username, text: textMessage, isOur: true }]))
       }
        
        
        
    }

    useEffect(()=>{
        const div = messageBoxRef.current;
        if(div){
        div.scrollIntoView({behavior:'smooth'});

        }
    },[messages])

    useEffect(()=>{
        // axios.get('https://pingme-5dgj.onrender.com/people').then(res=>{
        axios.get('http://localhost:3000/people').then(res=>{

            const onlineUsernames = onlinePeople.map(user => user.username);
            const offlinePeople1=res.data
            .filter(p=>p.username!==username)
            .filter(p => !onlineUsernames.includes(p.username)); 
            setofflinePeople(offlinePeople1);
            // console.log(offlinePeople)
           
            
        })
    },[onlinePeople])
   
    
    const onlineFunctionExcludingUser = onlinePeople.filter(p => p.username !== username)

    useEffect(() => {
        // axios.get(`https://pingme-5dgj.onrender.com/messages/:${selectedusername}`).then(res => {
        axios.get(`http://localhost:3000/messages/:${selectedusername}`).then(res => {

            
            if (res.data && Array.isArray(res.data.messages)) {
                setMessages(res.data.messages);
                
            } else {
                console.error("Expected an array of messages, but got:", res.data);
            }
    })
    }, [selectedusername]);

    return (
        <div className='flex h-screen'>
            <div className='w-1/4 bg-slate-300 '>
                <div className='text-blue-500 gap-2 flex  items-center  font-bold  text-2xl py-4 border-b-black px-4'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className=" size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                    </svg>
                    Ping Me
                </div>
                {onlineFunctionExcludingUser.map((item, index) => (
                    <div key={item.username}  onClick={() => setSelectedusername(item.username)} className={`p-2 font-bold flex gap-4 items-center cursor-pointer w-full ${item.username === selectedusername ? 'bg-slate-100 rounded-sm' : ''} `} >
                        <Avatar online={true} username={item.username} firstname={item.firstname} lastname={item.lastname} />
                        {item.firstname}{" "}{item.lastname} 
                    </div>
                ))}
                {offlinePeople.map((item) => (
                    <div key={item.username} onClick={() => setSelectedusername(item.username)} className={`p-2 font-bold flex gap-4 items-center cursor-pointer w-full ${item.username === selectedusername ? 'bg-slate-100 rounded-sm' : ''}`}>
                        <Avatar online={false} username={item.username} firstname={item.firstname} lastname={item.lastname} />
                        {item.firstname} {item.lastname}
                    </div>
                ))}
            </div>
            <div className='w-3/4 px-12 bg-slate-400 flex flex-col '>
                {!selectedusername && (<div className=' font-bold flex items-center justify-center h-full text-2xl opacity-50'>Please select a person to chat :)</div>)}

                {!!selectedusername && (
                    <div className='relative h-full p-2 '>
                        <div className='overflow-y-scroll absolute inset-0 px-4 no-scrollbar '>
                            {messages.map(message => (
                                <div key={message._id} className={`w-full   ${message.sender === username ? 'text-right' : 'text-left'}`}>
                                    
                                    <div className={`text-left inline-block p-2 my-2 rounded-md  text-lg ${message.sender === username ? 'bg-slate-700 ' : 'bg-slate-500'}`}>{message.text}</ div>

                                </div>
                            ))}
                            <div ref={messageBoxRef}>

                            </div>
                        </div>
                    </div>
                )}
                

                {selectedusername && (<form onSubmit={sendMessage} className='flex items-center gap-2 p-4 flex-grow '>
                    <input className='p-4 rounded-md flex-grow border-none ' value={textMessage} onChange={(e) => { setTextmessage(e.target.value) }} type="text" placeholder='type your message here ...' />
                    <button type='submit' className='p-4 bg-slate-700 text-white rounded-md'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                    </button>

                </form>)}
            </div>
        </div>
    );
}

export default Chat;
