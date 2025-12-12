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

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('ruolo');

  if (!token) {
    return <Navigate to="/login" state={{ message: "Devi prima accedere per visualizzare questa pagina" }} replace />;
  }

  // Se sono specificati dei ruoli permessi, controlliamo che l'utente ne abbia uno
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Se il ruolo non è autorizzato, rimanda alla home (o una pagina 403)
    return <Navigate to="/home" replace />;
  }

  return children;
};

// Modifica App component per usare ProtectedRoute
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

          {/* Rotte Protette per utenti loggati*/}
          <Route path="/storie" element={<ProtectedRoute><StoriesBoard /></ProtectedRoute>} />
          <Route path="/eventi" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
          
          {/* Rotte Protette solo per ENTE */}
          <Route path="/DashboardAffiliazione" element={<ProtectedRoute allowedRoles={['ente']}><DashboardAffiliazione /></ProtectedRoute>} />
          <Route path="/DashboardRichiesteServizio" element={<ProtectedRoute allowedRoles={['ente']}><DashboardRichiesteServizio /></ProtectedRoute>} />

          {/* Rotte Profili */}
          <Route path="/profiloente" element={<ProtectedRoute><ProfiloEnte /></ProtectedRoute>} />
          <Route path="/profilovolontario" element={<ProtectedRoute><ProfiloVolontario /></ProtectedRoute>} />
          <Route path="/profilobeneficiario" element={<ProtectedRoute><ProfiloBeneficiario /></ProtectedRoute>} />

          {/* Rotta Ricerca Geografica */}
          <Route path="/ricercageografica" element={<ProtectedRoute><RicercaGeografica /></ProtectedRoute>} />
          <Route path="/cerca" element={<ProtectedRoute><RisultatiRicerca /></ProtectedRoute>} />

          {/* Qualsiasi altro URL porta al Login */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}
export default App;