import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import axios from 'axios';
import toast from 'react-hot-toast';
const LoginComponent = ({ setCurrUser }) => {
    const navigate = useNavigate();
    const [loginUser, setLoginUser] = useState({
        userEmail: '',
        userPassword: ''
    });


    useEffect(() => {
        axios.get('https://localhost:3001/check-auth')
            .then(res => {
                if (res.data.isAuthenticated) {
                    navigate('/main'); // Redirect if user is already logged in
                }
            })
            .catch(err => {
                console.error('Error checking authentication', err);
            });
    }, [navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (loginUser.userEmail && loginUser.userPassword) {
            const newLoginUser = {
                email: loginUser.userEmail,
                password: loginUser.userPassword,
            };

            axios.post('http://localhost:3001/u/login', newLoginUser, {
                withCredentials: true
            })
                .then(res => {

                    if (res.data.success) {
                        toast.success(res.data.message)
                        setCurrUser(res.data.user);
                        localStorage.setItem('currUser', JSON.stringify(res.data.user));
                        navigate('/main');
                    }
                    else {
                        toast.error(res.data.message);
                    }
                })
                .catch(er => {
                    console.log(er.response.data.message);
                    toast.error(er.response.data.message);
                })
        }
        else {
            toast.error("Please fill all the fields");
        }
    }

    return (
        <div className='auth-container'>
            <form className='auth-form' onSubmit={handleLogin} >
                <h2>Login</h2>
                <input type="email" placeholder="Email" onChange={(e) => setLoginUser({ ...loginUser, userEmail: e.target.value })} required />
                <input type="password" placeholder="Password" onChange={(e) => setLoginUser({ ...loginUser, userPassword: e.target.value })} required />
                <button type="submit">Login</button>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Link to='/'>Register</Link>
                    <Link to='/forget-password'>Forget Password?</Link>
                </div>
            </form>
        </div>
    )
};

export default LoginComponent;
