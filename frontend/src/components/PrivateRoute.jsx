import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

function PrivateRoute({ component: Component }) {
  const [isAuth, setIsAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/username');
        setIsAuth(true);
      } catch (error) {
        console.error('Error fetching username:', error);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuth ? <Component /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;
