import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Lobby() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get('/api/auth/username');
        setUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };
  
    fetchUsername();
  
  }, []);
  const createRoom = async () => {
    try {
      const res = await axios.get('/api/room/create');
      const roomId = res.data.roomId;

      navigate('/room/' + roomId);
    } catch (error) {
      console.error('Login error:', error.response.data.message);
      setInvalid(true);
    }
  }

  const joinRoom = async () => {
    let input = prompt("Enter Room ID");
    while(!((parseInt(input)>=1000) && (parseInt(input)<=9999))){
      if(input === null || input ===""){
        return;
      }
      input = prompt("Invalid! Enter valid Room ID");
    }
    navigate('/room/' + input);
  }
  return (
    <div>
      <h2 className='login-header'>Lobby</h2>
      {!username ? (
        <p className='lobby-header'>Welcome to the game lobby!</p>
      ) : (
        <p className='lobby-header'>Welcome to Art Attack {username}!</p>
      )}
      <div className='lobby-room'>
        <button className='lobby-button' onClick={createRoom}>Create Random Room</button>
        <button className='lobby-button' onClick={joinRoom}>Join Room</button>
      </div>
      <div className='lobby-logout'><button className='landing-button' onClick={handleLogout}>Logout</button></div>
    </div>
  );
  
}

export default Lobby;