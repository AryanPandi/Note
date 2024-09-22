import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import './Component/note.css';
import MainComponent from './Component/Main/MainComponent';
import LoginComponent from './Component/User/LoginComponent';
import RegisterComponent from './Component/User/RegisterComponent';
import ProtectedRoute from './Component/ProtectedRoute';
import { useState } from 'react';
import ForgetPasswordComponent from './Component/User/ForgetPasswordComponent';


function App() {

  const [currUser,setCurrUser]=useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={< RegisterComponent/>} />
        <Route path="/login" element={<LoginComponent setCurrUser={setCurrUser}/>} />
        <Route path='/forget-password' element={ <ForgetPasswordComponent />} />
        <Route path="/main" element={<ProtectedRoute element={<MainComponent currUser={currUser} setCurrUser={setCurrUser} />}/>} />
      </Routes>
    </Router>
  );
}

export default App;
