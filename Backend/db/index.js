const mongoose =require("mongoose");



mongoose.connect("mongodburl");

const UserSchema=new mongoose.Schema({
    firstname:String,
    lastname:String,
    username:String,
    password:String
})

const MessageSchema=new mongoose.Schema({
    sender:{type:String,ref:'User'},
    recipient:{type:String,ref:'User'},
    text:String

},{timestamps:true})

const User=mongoose.model('User',UserSchema);
const Message=mongoose.model('Message',MessageSchema)
module.exports={
    User,
    Message
}