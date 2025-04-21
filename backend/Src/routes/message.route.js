import express from "express";
import { verifiedToken } from "../middleware/auth.middleware.js";
import { getMessages, getUserForSlideBar, sendMessages } from "../controllers/message.controller.js";

const messageRoute=express.Router();


messageRoute.get('/users', verifiedToken, getUserForSlideBar)
messageRoute.get('/:id', verifiedToken, getMessages)
messageRoute.post('/send/:id', verifiedToken, sendMessages)

export default messageRoute;