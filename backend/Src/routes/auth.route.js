import express from 'express';
import { logOut, signIn, signUp, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import { verifiedToken  } from "../middleware/auth.middleware.js";
const authRoute=express.Router();


authRoute.post('/sign-in', signIn )
authRoute.post('/sign-up', signUp)

authRoute.post('/log-out', logOut)
authRoute.put('/update-profile', verifiedToken , updateProfile)
authRoute.get('/check', verifiedToken, checkAuth)



export default authRoute;