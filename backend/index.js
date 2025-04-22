import express from"express";
import authRoute from "./Src/routes/auth.route.js";
import messageRoute from "./Src/routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./Src/lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./Src/lib/socket.js";


dotenv.config();

const PORT=process.env.PORT;

app.use(cors({
    origin: "https://playful-sprinkles-c1358f.netlify.app",
    credentials: true,
}))

app.use(cookieParser())
app.use(express.json({limit: '2mb'}));
app.use('/api/auth', authRoute);
app.use('/api/messages', messageRoute);



server.listen(PORT, ()=>{
    console.log(`server started at http://localhost:${PORT}`);
    connectDB();
})