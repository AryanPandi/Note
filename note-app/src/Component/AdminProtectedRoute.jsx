import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';


const AdminProtectedRoute = ({ element,currUser }) => {
 const [isAdmin, setisAdmin] = useState(null);


 useEffect(() => {
  if(currUser){
    axios.get(`http://localhost:3001/a/getAdminUser/${currUser._id}`,{ withCredentials: true,
      params: { 'role': 'admin'}
     })
     .then(res => {
      if (res.data.user) {
       setisAdmin(true);
      } else {
       setisAdmin(false);
      }
     })
     .catch(err => {
      console.error(err);
      setisAdmin(false);
     });
  }else{
    setisAdmin(false);
  }
 }, []);


 if (isAdmin === null) {
  return <div>Loading...</div>; // While checking authentication
 }


 return isAdmin ? element : <Navigate to="/login" />;
};


export default AdminProtectedRoute;