import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { io } from "../lib/socket.js"; // Update the import path as needed



  
export const signUp=async (req, res, next)=>{
    const {email, fullName, password}=req.body;
    try{
        if(!email || !fullName || !password) return res.status(400).json({message: "Enter all the values."});
        if(!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return res.status(400).json({message: "Enter enail in proper fornate."});
        const user= await User.findOne({email});
        if(user) return res.status(400).json({message: "User with same Email Already Exist."});
        if(password.length <6) return res.status(400).json({message : "Password must be atleast 6 characters."});
        const salt=await bcrypt.genSalt(10);
        const hashPassword= await bcrypt.hash(password, salt);
        const newUser=new User({
            email,
            fullName,
            password: hashPassword,
        });
        if(newUser){
            generateToken(newUser._id, res);
            const user=await newUser.save();

            res.status(201).json(user);
        }else{
            res.status(400).json({message: "Invalid user Data."});
        }
    }catch(e){
        console.log(e.message);
        res.status(500).json({message: e.message});
    }
}




export const signIn=async (req, res, next)=>{
    const {email, password}= req.body;
    try{
        if(!email || !password) return res.status(400).json({message: "Enter all the values."}); 
        const user =await User.findOne({email});
        if(!user) return res.status(400).json({message: "Invalid Email."});
        const isPass=await bcrypt.compare(password ,user.password)
        if(!isPass) return res.status(400).json({message: "Incorrect Password."});
        generateToken(user._id, res);
        res.status(201).json(user);

    }catch(e){
        console.log(e.message);
        res.status(500).json({message: e.message});
    }
}
export const logOut=(req, res, next)=>{
    try{
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({message: "Logged out successfully."})

    }catch(e){
        console.log(e.message);
        res.status(500).json({message: e.message});
    }
}


export const updateProfile=async(req, res, next)=>{
    try{
        const {profilePic}=req.body;
        const userId=req.user._id;
        if(!profilePic) return res.status(400).json({message :"Profile Pic is required."});
        const uploadRes=await cloudinary.uploader.upload(profilePic);
        const updateUser= await User.findByIdAndUpdate(userId, {profilePic: uploadRes.secure_url}, {new:true});
        res.status(201).json(updateUser)
                    

    }catch(e){
        console.log(e.message);
        res.status(500).json({message: e.message});
    }
}

export const checkAuth=(req, res, next)=>{
try{
    res.status(201).json(req.user);

}catch(e){
        console.log(e.message);
        res.status(500).json({message: e.message});
    }
}
