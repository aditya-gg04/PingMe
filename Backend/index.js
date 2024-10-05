const bodyParser = require("body-parser");
const express = require("express");
const { User, Message } = require("./db");
const app = express();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const bcrypt = require("bcryptjs")
const brryptsalt = bcrypt.genSaltSync(10)
const ws = require("ws");

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true 
}));
app.use(express.json());

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, JWT_SECRET, {}, (err, userData) => {
        if (err) throw err;
        const { username,firstname,lastname } = userData;
        res.json({
            username,
            firstname,
            lastname
        })
    })
})

async function getDataFromUser(req,res){
    return new  Promise ((resolve,reject)=>{

        const { token } = req.cookies;
        if(token){
            jwt.verify(token, JWT_SECRET, {}, (err, userData) => {
                if (err) throw err;
                resolve(userData)
            })
        }
        else
        {
            reject("No Token")
        }
    }
)  
}
app.post('/signup', async (req, res) => {
    const { firstname, lastname, username, password } = req.body;

    const userExists = await User.findOne({ username });
    if (userExists) {
        return res.status(409).json("username already exists!Log in")
    }


    const hashedPassword = bcrypt.hashSync(password, brryptsalt)
    await User.create(
        {

            firstname: firstname,
            lastname: lastname,
            username: username,
            password: hashedPassword
        });
    jwt.sign({ username,firstname,lastname }, JWT_SECRET, (err, token) => {
        if (err) throw err;
        res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json("ok")
    })

})

app.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    const userExists = await User.findOne({
        username
    })

    if (userExists) {
        const passok = bcrypt.compareSync(password, userExists.password)
        const firstname=userExists.firstname;
        const lastname=userExists.lastname;
        if (passok) {
            jwt.sign({ username,firstname,lastname }, JWT_SECRET, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).status(201).json("logged in")
            })
        }

    }
})

app.get('/messages/:username',async (req,res)=>{
    const {username}=req.params;
    const withoutSemicolon=username.split(':')[1];
    const userData= await getDataFromUser(req);
   

    const messages= await Message.find({
        sender:{$in:[withoutSemicolon,userData.username]},
        recipient:{$in:[userData.username,withoutSemicolon]}
    }).sort({createdAt:1});

    
    res.json({
        messages
    })

})

app.get("/people",async (req,res)=>{
    const users= await User.find({},{'_id':true,username:true,firstname:true,lastname:true});
    res.json(users);
})

const server = app.listen(3000);
const wss = new ws.WebSocketServer({ server });

wss.on('connection', (connection, req) => {

    function notifyAboutOnlinePeople(){
        [...wss.clients].forEach(client => {
            client.send(JSON.stringify({
                online: [...wss.clients].map(c => ({ username: c.username,firstname:c.firstname,lastname:c.lastname}))
            }))
        })
    }

    connection.isAlive=true;
    connection.timer=setInterval(()=>{
        connection.ping();
        connection.deathTimer = setTimeout(() => {
            connection.isAlive=false;
            clearInterval(connection.timer);
            connection.terminate();
            notifyAboutOnlinePeople();
        }, 1000);
    },3000)

    connection.on('pong',()=>{
        clearTimeout(connection.deathTimer); 
    })

    const cookies = req.headers.cookie;
    if (cookies) {
        const tokenString = cookies.split(';').find(str => str.startsWith('token='))
        if (tokenString) {
            const token = tokenString.split('=')[1];
            if (token) {
                jwt.verify(token, JWT_SECRET, {}, (err, userData) => {
                    if (err) throw err;
                    const { username,firstname,lastname } = userData;
                    connection.username = username;
                    connection.firstname =firstname;
                    connection.lastname =lastname;

                    notifyAboutOnlinePeople();
                })
            }
        }
    }

   


    connection.on('message',async (message)=>{
        
        try {
            const newMessage = JSON.parse(message.toString());
            const { recipient, text } = newMessage.message;

            if (recipient && text) {
               const messageDoc = await Message.create({
                    sender:connection.username,
                    recipient:recipient,
                    text:text
                });
                [...wss.clients]
                    .filter(c => c.username === recipient)
                    .forEach(c => c.send(JSON.stringify({ from: connection.username, text ,id:messageDoc._id, recipient})));
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    })

    // connection.on('close', () => {
    //     notifyAboutOnlinePeople(); // Notify when a user goes offline
    // });

    notifyAboutOnlinePeople();

})


