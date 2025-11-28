import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ChevronDown, LogOut, Settings, FileText, Briefcase, Users, Calendar, Heart, LogIn } from 'lucide-react';
import '../stylesheets/Navbar.css';
import LogoLumen from '../assets/logo-lumen.png';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    username: 'Utente',
    role: 'guest',
    isLoggedIn: false
  });
  const navigate = useNavigate();

  const navItems = [
    { label: 'Chi siamo', path: '/chisiamo' },
    { label: 'Storie', path: '/storie' },
    { label: 'Eventi', path: '/eventi' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('ruolo');

    if (token) {
      // Imposta lo stato iniziale basato su localStorage
      setCurrentUser(prev => ({
        ...prev,
        role: storedRole ? storedRole.toLowerCase() : 'guest',
        isLoggedIn: true
      }));

      // Recupera il ruolo aggiornato dal server
      fetch('http://localhost:8080/account/datiUtente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token })
      })
        .then(res => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json();
        })
        .then(data => {
          // Se l'API restituisce un oggetto con 'ruolo', aggiorniamo lo stato
          if (data.ruolo) {
            const normalizedRole = data.ruolo.toLowerCase();
            setCurrentUser(prev => ({
              ...prev,
              role: normalizedRole,
              username: data.nome || prev.username // Usa il nome se disponibile, altrimenti fallback
            }));
            // Aggiorna anche il localStorage per coerenza
            localStorage.setItem('ruolo', data.ruolo);
          }
        })
        .catch(err => {
          console.error("Errore nel recupero dati utente:", err);
          // Opzionale: se il token non è valido, potremmo fare logout o gestire l'errore
        });
    }
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('ruolo');
    setCurrentUser({ username: '', role: 'guest', isLoggedIn: false });
    setIsDropdownOpen(false);
    navigate('/login');
  };

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
              <Link
                key={index}
                to={item.path}
                className="nav-item"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="navbar-right">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Cerca..." className="search-input" />
          </div>



          <div className="profile-container" onClick={toggleDropdown}>
            <div className={`profile-pill ${isDropdownOpen ? 'active' : ''}`}>
              <div className="profile-avatar">
                {currentUser.role === 'guest' ? <User size={20} /> : (currentUser.username.charAt(0).toUpperCase())}
              </div>

              {currentUser.isLoggedIn && (
                <div className="profile-details">
                  <span className="user-name">{currentUser.username}</span>
                  <span className="user-role">{currentUser.role}</span>
                </div>
              )}

              <ChevronDown size={16} className={`arrow-icon ${isDropdownOpen ? 'rotated' : ''}`} />
            </div>

            {isDropdownOpen && (
              <DropdownMenu
                role={currentUser.role}
                onLogout={handleLogout}
              />
            )}
          </div>
        </div>

      </nav>
    </header>
  );
};

const DropdownMenu = ({ role, onLogout }) => {
  const getMenuItems = (role) => {
    switch (role) {
      case 'beneficiario': // Cittadino
        return [
          { label: 'Area Personale', icon: <Settings size={16} />, href: '/profilobeneficiario' },
          { label: 'Gestione richieste', icon: <FileText size={16} />, href: '/richieste' },
          { label: 'Logout', icon: <LogOut size={16} />, action: onLogout, type: 'danger' }
        ];
      case 'volontario':
        return [
          { label: 'Area Personale', icon: <Settings size={16} />, href: '/profilovolontario' },
          { label: 'Gestione servizi', icon: <Briefcase size={16} />, href: '/servizi' },
          { label: 'Gestione affiliazioni', icon: <Users size={16} />, href: '/affiliazioni' },
          { label: 'Logout', icon: <LogOut size={16} />, action: onLogout, type: 'danger' }
        ];
      case 'ente':
        return [
          { label: 'Area Personale', icon: <Settings size={16} />, href: '/profiloente' },
          { label: 'Gestione eventi', icon: <Calendar size={16} />, href: '/eventi-gestione' },
          { label: 'Gestione raccolte fondi', icon: <Heart size={16} />, href: '/raccolte-fondi' },
          { label: 'Gestione affiliazione', icon: <Users size={16} />, href: '/affiliazioni' },
          { label: 'Logout', icon: <LogOut size={16} />, action: onLogout, type: 'danger' }
        ];
      case 'guest':
      default:
        return [
          { label: 'Login', icon: <LogIn size={16} />, href: '/login' },
        ];
    }
  };

  const menuItems = getMenuItems(role);

  return (
    <div className="dropdown-box">
      {menuItems.map((item, index) => (
        item.action ? (
          <div
            key={index}
            className={`dropdown-row ${item.type === 'danger' ? 'danger' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              item.action();
            }}
          >
            <span className="row-icon">{item.icon}</span>{item.label}
          </div>
        ) : (
          <Link
            key={index}
            to={item.href}
            className={`dropdown-row ${item.type === 'danger' ? 'danger' : ''}`}
          >
            <span className="row-icon">{item.icon}</span>{item.label}
          </Link>
        )
      ))}
    </div>
  );
};

export default Navbar;