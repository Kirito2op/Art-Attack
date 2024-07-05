import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Lobby from './components/Lobby';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './components/LandingPage';
import NotFound from './components/NotFound';
import Room from './components/Room';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/lobby" element={<PrivateRoute component={Lobby} />} />
          <Route path="/room/:id" element={<PrivateRoute component={Room} />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
