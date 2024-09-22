import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import axios from 'axios';

const LoginComponent = ({ setCurrUser }) => {
    const navigate = useNavigate();
    const [loginUser, setLoginUser] = useState({
        userEmail: '',
        userPassword: ''
    });
    const [message, setMessage] = useState();
    const [error, setError] = useState(null);

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

            axios.post('http://localhost:3001/login', newLoginUser, {
                withCredentials: true
            })
                .then(res => {
                    if (res.data.success) {
                        setMessage(res.data.message);
                        setCurrUser(res.data.user);
                        localStorage.setItem('currUser', JSON.stringify(res.data.user));
                        navigate('/main');
                        setError(null);
                    }
                    else {
                        setError(res.data.error);
                    }
                })
                .catch(e => {
                    setError(e.response.data.error);
                    console.log(e.response ? e.response.data.error : e.message);
                })
        }
        else {
            setError("Please fill all the fields");
        }
    }

    return (
        <div className='auth-container'>
            <form className='auth-form' onSubmit={handleLogin} >
                <h2>Login</h2>
                {error ?
                    <div className="error-message">{error}</div>
                    :
                    <div className="message">{message}</div>
                }
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
