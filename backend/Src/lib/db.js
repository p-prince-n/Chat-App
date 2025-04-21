import mongoose from 'mongoose';


export const connectDB= async()=>{
    try{
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("MONGODB_URI is not defined");
        const conn= await mongoose.connect(uri);
        console.log(`MongoDB connected : ${conn.connection.host}`);
        
    }catch(e){
        console.log(e);
    }

}