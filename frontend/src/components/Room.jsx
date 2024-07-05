import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import PlayerBoard from './PlayerBoard';
import GameEnd from './GameEnd';

const Room = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingData, setDrawingData] = useState([]);
  const [invalidRoom, setInvalidRoom] = useState(true);
  const [isLegit, setIsLegit] = useState(false);
  const [username, setUsername] = useState(null);
  const [head, setHead] = useState(false);
  const [word, setWord] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerScore, setPlayerScore] = useState([]);
  const [gameEnd, setGameEnd] = useState(null);


  useEffect(() => {
    let newSocket;
  
    const fetchUsername = async () => {
      try {
        const response = await axios.get('/api/auth/username');
        setUsername(response.data.username);
  
        newSocket = io('http://localhost:5000', { query: { roomId: id, username: response.data.username } });
        setSocket(newSocket);
  
        newSocket.on('legit', () => {
          setInvalidRoom(false);
          setIsLegit(true);
        });
  
        newSocket.on('receiveMessage', (message) => {
          setMessages((prevMessages) => [...prevMessages, message]);
        });
  
        newSocket.on('receiveDrawing', (drawing) => {
          setDrawingData((prevDrawingData) => [...prevDrawingData, drawing]);
        });
  
        newSocket.on('game', (res) => {
          setWord(res.word);
          setGameStarted(true);
          setDrawingData([]);
          if(res.head){
            setHead(true);
          }
          else{
            setHead(false)
          }
        });
  
        newSocket.on('currentScore', ({ score }) => {
          setPlayerScore((score));
        });
  
        newSocket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
        });

        newSocket.on('gameEnd', ( { end }) => {
          setGameEnd(end);
        })
  
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };
  
    fetchUsername();
  
    return () => {
      if (newSocket) {
        newSocket.close();
      }
      setSocket(null);
    };
  }, []);

  useEffect(() => {
    if (isLegit && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawingData.forEach(drawing => {
        ctx.beginPath();
        ctx.moveTo(drawing.startX, drawing.startY);
        ctx.lineTo(drawing.endX, drawing.endY);
        ctx.stroke();
      });
    }
  }, [drawingData, isLegit]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      if(gameStarted){
        socket.emit('guess', { username: username, id: socket.id, guess: message});
        setMessage('');
      }
      else{
        const formattedMessage = `${username}: ${message}`;
        socket.emit('sendMessage', { room: id, message: message, username });
        setMessages((prevMessages) => [...prevMessages, formattedMessage]);
        setMessage('');
      }
    }
  };

  const handleDisconnect = () => {
    if (socket) {
      socket.disconnect();
      navigate('/lobby');
    }
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.__prevX = null;
    ctx.__prevY = null;
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing || !head) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const prevX = ctx.__prevX || x;
    const prevY = ctx.__prevY || y;

    ctx.__prevX = x;
    ctx.__prevY = y;

    if (socket) {
      socket.emit('sendDrawing', { room: id, startX: prevX, startY: prevY, endX: x, endY: y });
    }
  };

  const startGame = () => {
    let startButton = document.getElementById('start-button');
    startButton.classList.add('room-hidden');
    socket.emit('start');
  }

  if (invalidRoom) {
    return (
      <div>404 Room does not exist/already started</div>
    );
  }

  if(gameEnd){
    return(
      <GameEnd scores={gameEnd}></GameEnd>
    )
  }

  return (
    <div>
      <h1 className='room-word'>Room: {id}</h1>
      <div className='room-word'>{word}</div>
      <div className='room-cont'>
        <div>
          {playerScore.map((player) => (
            <PlayerBoard 
              key={player.id} 
              username={player.username} 
              score={player.score}
            />
          ))}
        </div>
        <div className='room-right-cont'>
          <canvas
              ref={canvasRef}
              width={750}
              height={500}
              style={{ border: '1px solid black' }}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              onMouseMove={draw}
              className='room-canvas'
            />
          <div className='room-right'>
            <div>
              {messages.map((msg, index) => (
                <div className='room-message' key={index}>{msg}</div>
              ))}
            </div>
            <div className='room-message-box'>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className='room-input'
              />
              <button className='landing-button room-send' onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
      </div>
      <div className='room-start'>
        <button className='room-button' onClick={handleDisconnect}>Disconnect</button>
        <button className='landing-button' id='start-button' onClick={startGame}>Start</button>
      </div>
    </div>
  );
};

export default Room;