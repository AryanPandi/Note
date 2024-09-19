import React, { useState } from 'react';
// import axios from 'axios';
import './Auth.css'; 
import axios from 'axios';

const RegisterComponent = () => {
    const [registerUser, setRegisterUser] = useState({
        userName: '',
        userPassword: '',
        userEmail:'',
    });

    const [error,setError]=useState(null);

    const HandleSubmit=(e)=>{
        e.preventDefault();
        if(registerUser.userEmail && registerUser.userName && registerUser.userPassword){
            console.log(registerUser);
            axios.post('http://localhost:3001/register',registerUser)
            .then(res=>{
                console.log(res.data.message);
            }).catch(e=>{
                console.log(e.response ? e.response.data.error : e.message);
            });
            
            setError(null);
        }
        else{
            setError("Please fill all the fields");
        }
    };


    return (
        <div className='auth-container'>
        <form className='auth-form' onSubmit={e=>HandleSubmit(e)} >
            <h2>Register</h2>
            { error?
             <div className="error-message">{error}</div>
            :
<></>
            }
            <input type="text" placeholder="Username" value={registerUser.userName} onChange={(e) => setRegisterUser({...registerUser,userName:e.target.value})} required />
            <input type="email" placeholder="Email" value={registerUser.userEmail} onChange={(e) => setRegisterUser({...registerUser,userEmail:e.target.value})} required />
            <input type="password" placeholder="Password" value={registerUser.userPassword} onChange={(e) => setRegisterUser({...registerUser,userPassword:e.target.value})}  />

            <button type="submit">Register</button>
        </form>
        </div>
    );


};

export default RegisterComponent;