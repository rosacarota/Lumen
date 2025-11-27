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
        {/* Rotta di default: Va alla home */}
        <Route path="/home" element={<Home />} />
        
        {/* Rotta Home: Dove si va dalla home */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chisiamo" element={<ChiSiamo />} />
        <Route path="/storie" element={<StoriesBoard />} />
        <Route path="/eventi" element={<EventsPage />} />

        {/* Rotta AccessoInfoProfilo*/}
        <Route path="/AccessoInfoProfilo" element={<AccessoInfoProfilo />} />
        
        {/* Qualsiasi altro URL porta al Login */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
}

export default App;