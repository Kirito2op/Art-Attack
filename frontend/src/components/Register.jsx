import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [invalid, setInvalid] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/lobby');
    } catch (error) {
      console.error('Registration error:', error.response.data.message);
      setInvalid(true);
    }
  };
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/username');
        navigate('/lobby');
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };
    checkAuth();
  }, []);
  return (
    <div>
      <h2 className='login-header'>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          minLength={3}
          maxLength={20}
          required
          className='login-input'
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          minLength={6}
          onChange={(e) => setPassword(e.target.value)}
          required
          className='login-input'
        />
        <div className='register-button'><button type="submit" className='landing-button'>Register</button></div>
      </form>
      {invalid && <div>Invalid Credentials!</div>}
    </div>
  );
}

export default Register;