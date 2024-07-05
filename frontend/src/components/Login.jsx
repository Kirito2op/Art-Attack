import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import '../App.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [invalid, setInvalid] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/lobby');
    } catch (error) {
      console.error('Login error:', error.response.data.message);
      setInvalid(true);
    }
  };

  const handleClick = () => {
    navigate('/register')
  }
  return (
    <div>
      <h2 className='login-header'>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className='login-form login-input'
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className='login-form login-input'
        />
        <button className='landing-button login-form' type="submit">Login</button>
      </form>
      {invalid && <div>Invalid Credentials!</div>}
      <div className='login-register'><button className='landing-button' onClick={handleClick}>Register!</button></div>
    </div>
  );
}

export default Login;