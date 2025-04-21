import React, { useEffect } from 'react'
import {Route, Routes, Navigate} from 'react-router-dom';
import { Navbar } from './Components/Navbar';
import { HomePage } from './Pages/HomePage';
import { SettingPage } from './Pages/SettingPage';
import { LoginPage } from './Pages/LoginPage';
import { SignUpPage } from './Pages/SignUpPage';
import ProfilePage from './Pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore.js';
import { Loader } from 'lucide-react';
import {Toaster} from "react-hot-toast"
import { useThemeStore } from './store/useThemeStore.js';
import SelectedProfilePage from './Pages/SelectedProfilePage.jsx';

function App() {
  const {authUser, checkAuth, isCheckingAuth, onlineUsers}=useAuthStore();

  const {theme}= useThemeStore();
  useEffect(()=>{
    checkAuth();
  }, [checkAuth]); 

  if(isCheckingAuth && !authUser) return (
      <div className='flex items-center justify-center h-screen '>
      <Loader className="size-10 animate-spin"/>
    </div>
    );
 
  return (
    <div data-theme={theme} className="w-full overflow-x-auto">
      <Navbar/>
      <Routes>
        <Route path='/' element={authUser?<HomePage/>: <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser?<SignUpPage/>: <Navigate to="/" />} />
        <Route path='/login' element={!authUser?<LoginPage/>:<Navigate to="/" />} />
        <Route path='/setting' element={<SettingPage/>} />
        <Route path='/profile' element={authUser?<ProfilePage/>: <Navigate to="/login" />} />
        <Route path='/selectedprofile' element={authUser?<SelectedProfilePage/>: <Navigate to="/login" />} />
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App