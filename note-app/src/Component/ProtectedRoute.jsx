import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/check-auth',{ withCredentials: true })
      .then(res => {

        console.log(res.data.isAuthenticated);
        if (res.data.isAuthenticated) {
          setIsAuthenticated(true); // User is authenticated
        } else {
          setIsAuthenticated(false); // User is not authenticated
        }
      })
      .catch(err => {
        console.error(err);
        setIsAuthenticated(false);
      });
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // While checking authentication
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
