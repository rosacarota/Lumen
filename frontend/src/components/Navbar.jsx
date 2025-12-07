import React, { useState, useEffect } from 'react';
// RIMOSSO: import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ChevronDown, LogOut, Settings, FileText, Briefcase, Users, Calendar, Heart, LogIn, Earth } from 'lucide-react';
import '../stylesheets/Navbar.css';
import LogoLumen from '../assets/logo-lumen.png';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    username: 'Utente',
    role: 'guest',
    immagine: null,
    isLoggedIn: false
  });


  const navItems = [
    { label: 'Chi siamo', path: '/chisiamo' },
    { label: 'Storie', path: '/storie' },
    { label: 'Eventi', path: '/eventi' }
  ];

  // AGGIUNTA: Se il ruolo è 'ente', aggiungo la voce "Affiliazione"
  if (currentUser.role === 'ente') {
    navItems.push({ label: 'Affiliati', path: '/DashboardAffiliazione' });
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    // --- LOGICA CHIAMATA API DIRETTA ---
    const fetchUserDirectly = async () => {
      try {
        const response = await fetch(`http://localhost:8080/account/datiUtente?token=${token}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          //body: JSON.stringify({ token: token })
        });

        if (response.ok) {
          const apiData = await response.json();

          localStorage.setItem('email', apiData.email);
          let img = null;
          if (apiData.immagine) {
            img = apiData.immagine.startsWith('data:image')
              ? apiData.immagine
              : `data:image/jpeg;base64,${apiData.immagine}`;
          }

          setCurrentUser({
            isLoggedIn: true,
            username: apiData.nome || 'Utente',
            role: (apiData.ruolo || 'guest').toLowerCase(),
            immagine: img
          });

          localStorage.setItem('ruolo', (apiData.ruolo || 'guest').toLowerCase());
        }
      } catch (error) {
        console.error("Errore fetch:", error);
      }
    };

    if (token) {
      fetchUserDirectly();
    }
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('ruolo');
    setCurrentUser({ username: 'Utente', role: 'guest', immagine: null, isLoggedIn: false });
    setIsDropdownOpen(false);

    // SOSTITUZIONE NAVIGATE: Redirect nativo
    window.location.href = '/login';
  };

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        <div className="navbar-left">
          <div className="navbar-logo">
            {/* SOSTITUZIONE LINK -> A */}
            <a href="/home">
              <div className="logo-circle">
                <img src={LogoLumen} alt="Lumen Logo" />
              </div>
            </a>
          </div>
          <div className="nav-divider"></div>
          <div className="navbar-links">
            {navItems.map((item, index) => (
              /* SOSTITUZIONE LINK -> A */
              <a key={index} href={item.path} className="nav-item">
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="navbar-right">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Cerca..."
              className="search-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // Assicurati che window.location funzioni o usa navigate se sei dentro Router
                  window.location.href = `/cerca?q=${e.target.value}`;
                }
              }}
            />
          </div>

          {currentUser.role === 'beneficiario' && (
            <a href="/ricercageografica" className="icon-btn" title="Ricerca Geografica">
              <Earth size={20} />
            </a>
          )}

          <div className="profile-container" onClick={toggleDropdown}>
            <div className={`profile-pill ${isDropdownOpen ? 'active' : ''}`}>
              <div className="profile-avatar">
                {currentUser.role === 'guest' ? (
                  <User size={20} />
                ) : currentUser.immagine ? (
                  <img
                    src={currentUser.immagine}
                    alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                ) : (
                  currentUser.username.charAt(0).toUpperCase()
                )}
              </div>

              {currentUser.isLoggedIn && (
                <div className="profile-details">
                  <span className="user-name">{currentUser.username}</span>
                  <span className="user-role">{currentUser.role}</span>
                </div>
              )}
              <ChevronDown size={16} className={`arrow-icon ${isDropdownOpen ? 'rotated' : ''}`} />
            </div>
            {isDropdownOpen && <DropdownMenu role={currentUser.role} onLogout={handleLogout} />}
          </div>
        </div>
      </nav>
    </header>
  );
};

const DropdownMenu = ({ role, onLogout }) => {
  const safeRole = role ? role.toLowerCase() : 'guest';
  const getMenuItems = (r) => {
    localStorage.setItem('searchEmail', localStorage.getItem('email'));
    switch (r) {
      case 'beneficiario':
        return [
          { label: 'Area Personale', icon: <Settings size={16} />, href: '/profilobeneficiario' },
          { label: 'Gestione richieste', icon: <FileText size={16} />, href: '/richieste' },
          { label: 'Logout', icon: <LogOut size={16} />, action: onLogout, type: 'danger' }
        ];
      case 'volontario':
        return [
          { label: 'Area Personale', icon: <Settings size={16} />, href: '/profilovolontario' },
          { label: 'Gestione servizi', icon: <Briefcase size={16} />, href: '/servizi' },
          { label: 'Gestione affiliazione', icon: <Users size={16} />, href: '/affiliazione' },
          { label: 'Logout', icon: <LogOut size={16} />, action: onLogout, type: 'danger' }
        ];
      case 'ente':
        return [
          { label: 'Area Personale', icon: <Settings size={16} />, href: '/profiloente' },
          { label: 'Gestione eventi', icon: <Calendar size={16} />, href: '/eventi-gestione' },
          { label: 'Gestione raccolte fondi', icon: <Heart size={16} />, href: '/raccolte-fondi' },
          { label: 'Gestione affiliati', icon: <Users size={16} />, href: '/DashboardAffiliazione' },
          { label: 'Logout', icon: <LogOut size={16} />, action: onLogout, type: 'danger' }
        ];
      case 'guest':
      default:
        return [{ label: 'Login', icon: <LogIn size={16} />, href: '/login' }];
    }
  };

  const menuItems = getMenuItems(safeRole);

  return (
    <div className="dropdown-box">
      {menuItems.map((item, index) => (
        item.action ? (
          <div key={index} className={`dropdown-row ${item.type === 'danger' ? 'danger' : ''}`} onClick={(e) => { e.stopPropagation(); item.action(); }}>
            <span className="row-icon">{item.icon}</span>{item.label}
          </div>
        ) : (
          /* SOSTITUZIONE LINK -> A */
          <a key={index} href={item.href} className={`dropdown-row ${item.type === 'danger' ? 'danger' : ''}`}>
            <span className="row-icon">{item.icon}</span>{item.label}
          </a>
        )
      ))}
    </div>
  );
};

export default Navbar;