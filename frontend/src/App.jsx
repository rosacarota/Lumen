// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home'; 
import EventsPage from './pages/EventsPage';
import AccessoInfoProfilo from './components/AccessoInfoProfilo';
import StoriesBoard from './pages/StoriesBoard';
import ChiSiamo from './pages/ChiSiamo';


function App() {
  return (
    <div className="App">


      

      {/* ROUTING se volete modificare/aggiungere la vostra pagina cambiate il path e il component */}
      <Routes>
        {/* Rotta di default: Va al Login */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Rotta Home: Dove si va dopo il login */}
        <Route path="/home" element={<Home />} />
        <Route path="/chisiamo" element={<ChiSiamo />} />

        {/* Rotte Bacheca Eventi/Storie dalla Home*/}
        <Route path="/storie" element={<StoriesBoard />} />
        <Route path="/eventi" element={<EventsPage />} />

        {/* Rotta AccessoInfoProfilo*/}
        <Route path="/AccessoInfoProfilo" element={<AccessoInfoProfilo />} />
        
        {/* Qualsiasi altro URL porta al Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;