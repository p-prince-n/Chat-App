import {Server} from "socket.io";
import http from "http";
import express from "express";

const app= express();
const server= http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["https://incredible-macaron-49f4f5.netlify.app","http://localhost:5173"],

    }
});

export const getReceiverSocketId=(userId)=>{
    return userSocketMap[userId];
}

const userSocketMap={};

io.on("connection", (socket)=>{

    const userIds=socket.handshake.query.userId;
    if(userIds) userSocketMap[userIds]=socket.id;

    //io.emit() is used to send events to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", ()=>{
        console.log('A User disconnected : '+ socket.id);
        delete userSocketMap[userIds];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
})

export {io, server, app};