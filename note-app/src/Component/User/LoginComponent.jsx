import React, { useState } from 'react';
// import axios from 'axios';
import './Auth.css'; 

const LoginComponent=()=>{

    const [loginUser, setLoginUser] = useState({
        userName: '',
        userPassword: ''
    });

    return (
        <div className='auth-container'>
        <form className='auth-form' >
            <h2>Login</h2>
            <input type="text" placeholder="Username" onChange={(e) => setLoginUser({...loginUser,userName:e.target.value})} required />
            <input type="password" placeholder="Password" onChange={(e) => setLoginUser({...loginUser,userPassword:e.target.value})} required />
            <button type="submit">login</button>
        </form>
        </div>
    )
};

export default LoginComponent;
