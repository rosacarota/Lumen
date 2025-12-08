// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy loading delle pagine per ottimizzare il bundle iniziale
const LoginPage = lazy(() => import('./pages/LoginPage'));
const Home = lazy(() => import('./pages/Home'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const StoriesBoard = lazy(() => import('./pages/StoriesBoard'));
const ChiSiamo = lazy(() => import('./pages/ChiSiamo'));
const ProfiloEnte = lazy(() => import('./pages/ProfiloEnte'));
const ProfiloVolontario = lazy(() => import('./pages/ProfiloVolontario'));
const ProfiloBeneficiario = lazy(() => import('./pages/ProfiloBeneficiario'));
const DashboardAffiliazione = lazy(() => import('./pages/DashboardAffiliazione'));
const DashboardRichiesteServizio = lazy(() => import('./pages/DashboardRichiesteServizio'));
const RicercaGeografica = lazy(() => import('./pages/RicercaGeografica'));
const RisultatiRicerca = lazy(() => import('./pages/RisultatiRicerca'));

const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div className="loading-spinner">Caricamento...</div>
  </div>
);

function App() {
  return (
    <div className="App">
      <Navbar />
      {/* ROUTING se volete modificare/aggiungere la vostra pagina cambiate il path e il component */}
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Rotta di default: Va alla home */}
          <Route path="/home" element={<Home />} />

          {/* Rotta Home: Dove si va dalla home */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/chisiamo" element={<ChiSiamo />} />
          <Route path="/storie" element={<StoriesBoard />} />
          <Route path="/eventi" element={<EventsPage />} />
          <Route path="/DashboardAffiliazione" element={<DashboardAffiliazione />} />
          <Route path="/DashboardRichiesteServizio" element={<DashboardRichiesteServizio />} />

          {/* Rotte Profili */}
          <Route path="/profiloente" element={<ProfiloEnte />} />
          <Route path="/profilovolontario" element={<ProfiloVolontario />} />
          <Route path="/profilobeneficiario" element={<ProfiloBeneficiario />} />

          {/* Rotta Ricerca Geografica */}
          <Route path="/ricercageografica" element={<RicercaGeografica />} />
          <Route path="/cerca" element={<RisultatiRicerca />} />

          {/* Qualsiasi altro URL porta al Login */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}
export default App;