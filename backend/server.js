const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { users, closed, words } = require('./utils');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);

app.use('/api/room', roomRoutes);

app.get('/', (req, res) => {
  res.json({ name: 'hello' });
});

let answer = '';
let total = 0;
let currentHead;

io.on('connection', (socket) => {
  const { username, roomId } = socket.handshake.query;
  if(!users[roomId] || closed[roomId]){
    socket.disconnect(true);
  }
  if (roomId && users[roomId]) {
    socket.emit('legit');
    socket.join(roomId);
    users[roomId].push({username: username, id: socket.id, score: 0 });
    socket.on('sendMessage', ({ room, username, message }) => {
      socket.to(room).emit('receiveMessage', username + ': ' + message);
    });

    socket.on('sendDrawing', ({ room, startX, startY, endX, endY }) => {
      io.to(room).emit('receiveDrawing', { startX, startY, endX, endY });
    });

    socket.on('disconnect', () => {
      if (users[roomId]) {
        users[roomId] = users[roomId].filter(user => user.id !== socket.id);
        if (users[roomId].length === 0) {
          delete users[roomId];
          delete closed[roomId];
        }
      }
    });
    socket.on('guess', ({ username, id, guess }) => {
      if(id===currentHead){
        io.to(roomId).emit('receiveMessage', username + ': ' + guess);
      }
      else if(guess==answer){
        for(let i=0;i<users[roomId].length;i++){
          if(id===users[roomId][i].id){
            users[roomId][i].score+= total*100;
            total--;
          }
        }
        io.to(roomId).emit('receiveMessage', username + ' guessed it right!');
      }
      else{
        io.to(roomId).emit('receiveMessage', username + ': ' + guess);
      }
    })
    socket.on('start', () => {
      closed[roomId] = true;
      
      function runRound(index) {
        if(!users[roomId]){
          return;
        }
        let score = users[roomId];
        io.to(roomId).emit('currentScore', { score });
        if (index < users[roomId].length) {
          total = users[roomId].length;
          let randindex = Math.floor(Math.random() * 100);
          answer = words[randindex];
          currentHead = users[roomId][index].id;
          let blank = '_ '.repeat(answer.length);
          for (let j = 0; j < users[roomId].length; j++) {
            if (users[roomId][index].id === users[roomId][j].id) {
              io.to(users[roomId][index].id).emit('game', { word: answer, head: true });
            } else {
              io.to(users[roomId][j].id).emit('game', { word: blank, head: false });
            }
          }
          total = users[roomId].length - 1;
  
          setTimeout(() => runRound(index + 1), 5000);
        }
        else{
          let end = users[roomId];
          io.to(roomId).emit('gameEnd', { end });
        }
      }
      runRound(0);
    });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

