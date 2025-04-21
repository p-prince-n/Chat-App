import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUserForSlideBar=async(req, res, next)=>{
    try{
        const selfUserId=req.user._id;
        const userExceptSelf=await User.find({_id: {$ne: selfUserId}}).select("-password");
        res.status(200).json(userExceptSelf);
    }catch(e){
        console.log(e.message);
        res.status(500).json({message: e.message});
    }
}

export const getMessages=async(req, res, next)=>{
    try{
        const {id:userToChatId}=req.params;
        const myId=req.user._id;
        const messages=await Message.find({
            $or: [
                {senderId: userToChatId, receiverId: myId},
                {senderId: myId , receiverId:userToChatId}
            ]
        });
        if (messages.length === 0) {
            console.log("No messages found between the users.");
          }
        res.status(200).json(messages);
    }catch(e){
        console.log(e.message);
        res.status(500).json({message: e.message});
    }
}

export const sendMessages=async(req, res, next)=>{
    try{
        const {text, image}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id;
        let imageurl;
        if(image){
            const uploadRes=await cloudinary.uploader.upload(image);
            imageurl=uploadRes.secure_url;
        }
        let newMessage= new Message({
            senderId,
            receiverId,
            text,
            image: imageurl,
        });
         newMessage=await newMessage.save();

         const recieverSocketId=getReceiverSocketId(receiverId);
         if(recieverSocketId){
            //it only send message to perticular user
            io.to(recieverSocketId).emit("newMessage", newMessage);
         }

         res.status(200).json(newMessage);
        
 
    }catch(e){
        console.log(e.message);
        res.status(500).json({message: e.message});
    }
}