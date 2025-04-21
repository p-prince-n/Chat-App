import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client";




const BASE_URL="http://localhost:3000";



export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false, //if is it is true then it show loading bar at submit button
  isLoggingIn: false, //if is it is true then it show loading bar at login button
  isUpdateingProfile: false,
  isCheckingAuth: true,
  onlineUsers:[],
  socket:null,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (e) {
      set({ authUser: null });
      console.log("Exxor in checkAuth" + e);
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/sign-up", data);
      toast.success("Account created successfully.");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (e) {
      console.log(e.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  logOut: async () => {
    try {
      await axiosInstance.post("/auth/log-out");
      set({ authUser: null});
      toast.success("Logged Out successfully.");
      get().disconnectSocket();
    } catch (e) {
      console.log(e.response.data.message);
    }
  },
  logIn: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/sign-in", data);
      toast.success("Sign In successfully.");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (e) {
      toast.error(e.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  updateProfile: async(data)=>{
    set({ isUpdateingProfile: true });
    try{
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully.");

    }catch(e){
      toast.error(e.response.data.message);
    }finally{
      set({ isUpdateingProfile: false });
    }
  },
  connectSocket: ()=>{
    const {authUser}=get();
    if(!authUser || get().socket?.connected) return;
    const socket=io(BASE_URL,{
      query: {
        userId: authUser._id,
      }
    });
    socket.connect();
    set({socket: socket});
    socket.on("getOnlineUsers", (userId)=>{
      set({onlineUsers: userId })
    });
    

  },
  disconnectSocket: ()=>{
    if(get().socket?.connected) get().socket.disconnect();
  },
}));
