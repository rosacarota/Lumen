import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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

  const navigate = useNavigate();
  const location = useLocation();
  const lastTokenRef = useRef(null);

  const navItems = [
    { label: 'Chi siamo', path: '/chisiamo' },
    { label: 'Storie', path: '/storie' },
    { label: 'Eventi', path: '/eventi' }
  ];

  if (currentUser.role === 'ente') {
    navItems.push({ label: 'Affiliati', path: '/DashboardAffiliazione' });
    navItems.push({ label: 'Servizi', path: '/DashboardRichiesteServizio' });
  }

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Helper to fetch data
    const fetchUserDirectly = async () => {
      try {
        const response = await fetch(`http://localhost:8080/account/datiUtente?token=${token}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
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

    if (token !== lastTokenRef.current) {
      lastTokenRef.current = token;

      if (token) {
        fetchUserDirectly();
      } else {
        // Token removed -> Reset to Guest
        setCurrentUser({
          username: 'Utente',
          role: 'guest',
          immagine: null,
          isLoggedIn: false
        });
        localStorage.removeItem('ruolo');
      }
    }
  }, [location.pathname]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('ruolo');
    setCurrentUser({ username: 'Utente', role: 'guest', immagine: null, isLoggedIn: false });
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/cerca?q=${e.target.value}`);
    }
  }

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        <div className="navbar-left">
          <div className="navbar-logo">
            <Link to="/home">
              <div className="logo-circle">
                <img src={LogoLumen} alt="Lumen Logo" />
              </div>
            </Link>
          </div>
          <div className="nav-divider"></div>
          <div className="navbar-links">
            {navItems.map((item, index) => (
              <Link key={index} to={item.path} className="nav-item">
                {item.label}
              </Link>
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
              onKeyDown={handleSearch}
            />
          </div>

          {currentUser.role === 'beneficiario' && (
            <Link to="/ricercageografica" className="icon-btn" title="Ricerca Geografica">
              <Earth size={20} />
            </Link>
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
            {isDropdownOpen && <DropdownMenu role={currentUser.role} onLogout={handleLogout} onClose={() => setIsDropdownOpen(false)} />}
          </div>
        </div>
      </nav>
    </header>
  );
};

const DropdownMenu = ({ role, onLogout, onClose }) => {
  const safeRole = role ? role.toLowerCase() : 'guest';

  // Helper to handle navigation to personal area ensuring searchEmail is reset to self
  const handlePersonalAreaClick = () => {
    localStorage.setItem('searchEmail', localStorage.getItem('email'));
  };

  const getMenuItems = (r) => {
    switch (r) {
      case 'beneficiario':
        return [
          { label: 'Area Personale', icon: <Settings size={16} />, to: '/profilobeneficiario', onClick: handlePersonalAreaClick },
          { label: 'Logout', icon: <LogOut size={16} />, action: onLogout, type: 'danger' }
        ];
      case 'volontario':
        return [
          { label: 'Area Personale', icon: <Settings size={16} />, to: '/profilovolontario', onClick: handlePersonalAreaClick },
          { label: 'Logout', icon: <LogOut size={16} />, action: onLogout, type: 'danger' }
        ];
      case 'ente':
        return [
          { label: 'Area Personale', icon: <Settings size={16} />, to: '/profiloente', onClick: handlePersonalAreaClick },
          { label: 'Gestione affiliati', icon: <Users size={16} />, to: '/DashboardAffiliazione' },
          { label: 'Gestione servizi', icon: <FileText size={16} />, to: '/DashboardRichiesteServizio' },
          { label: 'Logout', icon: <LogOut size={16} />, action: onLogout, type: 'danger' }
        ];
      case 'guest':
        return [{ label: 'Login', icon: <LogIn size={16} />, to: '/login' }];
      default:
        return [{ label: 'Login', icon: <LogIn size={16} />, to: '/login' }];
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
          <Link
            key={index}
            to={item.to}
            className={`dropdown-row ${item.type === 'danger' ? 'danger' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (item.onClick) item.onClick();
              if (onClose) onClose();
            }}
          >
            <span className="row-icon">{item.icon}</span>{item.label}
          </Link>
        )
      ))}
    </div>
  );
};

export default Navbar;