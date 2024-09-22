import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import axios from 'axios';

const ForgetPasswordComponent = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleForgetPassword = (e) => {
        e.preventDefault();

        // Add your logic for password reset here
        if (!email) {
            setError("Please enter a valid email");
            return;
        }
        console.log(email);
        axios.post('http://localhost:3001/forgetpassword',{email})
        .then(res=>{
            console.log(res.data.message);
        })
        .catch(e=>{
            console.log(e);
        })

        // Example logic to handle request
        setError('');
        setMessage('If the email is registered, a password reset link will be sent.');
    };

    return (
        <div className='auth-container'>
            <form className='auth-form' >
                <h2>Forget Password</h2>

                {error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <div className="message">{message}</div>
                )}

                <input type="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} required />

                <button type="submit" onClick={e=> handleForgetPassword(e)}>Send Reset Link</button>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Link to='/'>Register</Link>
                    <Link to='/login'>Back to Login</Link>
                </div>
            </form>
        </div>
    );
};

export default ForgetPasswordComponent;