import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VideoFeed from './pages/VideoFeed';
import Upload from './pages/Upload';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<VideoFeed />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
