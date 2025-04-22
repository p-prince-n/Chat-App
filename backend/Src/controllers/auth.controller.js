import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { io } from "../lib/socket.js"; // ensure this import is correct

export const signUp = async (req, res, next) => {
  const { email, fullName, password } = req.body;
  try {
    if (!email || !fullName || !password) return res.status(400).json({ message: "Enter all the values." });
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return res.status(400).json({ message: "Enter email in proper format." });

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User with same Email Already Exists." });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters." });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      fullName,
      password: hashPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      const savedUser = await newUser.save();

   
      io.emit("newUser", {
        _id: savedUser._id,
        email: savedUser.email,
        fullName: savedUser.fullName,
        profilePic: savedUser.profilePic || null,
      });

      res.status(201).json(savedUser);
    } else {
      res.status(400).json({ message: "Invalid user data." });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: e.message });
  }
};





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
