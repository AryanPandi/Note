import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import './Component/note.css';
import MainComponent from './Component/Main/MainComponent';
import LoginComponent from './Component/User/LoginComponent';
import RegisterComponent from './Component/User/RegisterComponent';
import AdminMainComponent from './Component/Main/AdminMainComponent';
import ProtectedRoute from './Component/ProtectedRoute';
import AdminProtectedRoute from './Component/AdminProtectedRoute';
import { useEffect, useState } from 'react';
import ForgetPasswordComponent from './Component/User/ForgetPasswordComponent';
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
function App() {
 let user = localStorage.getItem('currUser');
 const [currUser,setCurrUser]=useState(user ? JSON.parse(user) : null);


 return (
  <>
  <Toaster/>
  <Router>
   <Routes>
    <Route path="/" element={< RegisterComponent/>} />
    <Route path="/login" element={<LoginComponent currUser={currUser} setCurrUser={setCurrUser}/>} />
    <Route path='/forget-password' element={ <ForgetPasswordComponent />} />
    {/* <Route path="/main" element={<ProtectedRoute element={<MainComponent currUser={currUser} setCurrUser={setCurrUser} />}/>} />/ */}
    <Route path="/main" element={<MainComponent currUser={currUser} setCurrUser={setCurrUser} />} />
    <Route path="/adminView" element={<AdminProtectedRoute element={<AdminMainComponent currUser={currUser} setCurrUser={setCurrUser}/>} currUser={currUser} />} />
   </Routes>
  </Router>
  </>
 );
}


export default App;