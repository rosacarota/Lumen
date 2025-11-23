import React, { useState } from 'react';
import { Search, Bell, User, ChevronDown, LogOut, Settings, FileText, Briefcase, Users, Calendar, Heart, LogIn, UserPlus } from 'lucide-react';
import '../stylesheets/Navbar.css';
import LogoLumen from '../assets/logo-lumen.png';

const currentUser = { 
  username: null, 
  role: 'guest' 
};

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navItems = ['Chi Siamo', 'Storie', 'Eventi'];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        
        <div className="navbar-left">
          
          <div className="navbar-logo">
            <div className="logo-circle">
               <img src={LogoLumen} alt="Lumen Logo" />
            </div>
          </div>

          <div className="nav-divider"></div>

          <div className="navbar-links">
            {navItems.map((item, index) => (
              <a key={index} href={`#${item.replace(' ', '').toLowerCase()}`} className="nav-item">
                {item}
              </a>
            ))}
          </div>

        </div>

        <div className="navbar-right">
          
          <div className="icon-btn" title="Cerca">
            <Search size={20} />
          </div>
          
          {/* NOTIFICHE: Nascoste per il guest */}
          {currentUser.role !== 'guest' && (
            <div className="icon-btn" title="Notifiche">
              <Bell size={20} />
            </div>
          )}

          {/* Profilo & Dropdown */}
          <div className="profile-container" onClick={toggleDropdown}>
            <div className={`profile-pill ${isDropdownOpen ? 'active' : ''}`}>
              
              {/* Avatar: Icona generica per guest */}
              <div className="profile-avatar">
                {currentUser.role === 'guest' ? (
                  <User size={20} />
                ) : (
                  currentUser.username.charAt(0).toUpperCase()
                )}
              </div>
              
              {/* Dettagli Nome/Ruolo: Nascosti per il guest */}
              {currentUser.role !== 'guest' && (
                <div className="profile-details">
                  <span className="user-name">{currentUser.username}</span>
                  <span className="user-role">{currentUser.role}</span>
                </div>
              )}
              
              <ChevronDown size={16} className={`arrow-icon ${isDropdownOpen ? 'rotated' : ''}`} />
            </div>

            {isDropdownOpen && <DropdownMenu role={currentUser.role} />}
          </div>
        </div>

      </nav>
    </header>
  );
};

// Componente Menu Dropdown
const DropdownMenu = ({ role }) => {
  const getMenuItems = (role) => {
    switch(role) {
      case 'beneficiario': 
        return [
          { label: 'Modifica account', icon: <Settings size={16} />, href: '#settings' }, 
          { label: 'Gestione richieste', icon: <FileText size={16} />, href: '#requests' }, 
          { label: 'Logout', icon: <LogOut size={16} />, href: '#logout', type: 'danger' }
        ];
      case 'volontario': 
        return [
          { label: 'Modifica account', icon: <Settings size={16} />, href: '#settings' }, 
          { label: 'Gestione servizi', icon: <Briefcase size={16} />, href: '#services' }, 
          { label: 'Gestione affiliazioni', icon: <Users size={16} />, href: '#affiliations' }, 
          { label: 'Logout', icon: <LogOut size={16} />, href: '#logout', type: 'danger' }
        ];
      case 'ente': 
        return [
          { label: 'Modifica account', icon: <Settings size={16} />, href: '#settings' }, 
          { label: 'Gestione eventi', icon: <Calendar size={16} />, href: '#events' }, 
          { label: 'Gestione raccolte fondi', icon: <Heart size={16} />, href: '#fundraising' }, 
          { label: 'Gestione affiliazione', icon: <Users size={16} />, href: '#affiliations' }, 
          { label: 'Logout', icon: <LogOut size={16} />, href: '#logout', type: 'danger' }
        ];
      // CASO GUEST (Default)
      case 'guest': 
      default: 
        return [
          { label: 'Login', icon: <LogIn size={16} />, href: '#login' }, 
          { label: 'Registrazione', icon: <UserPlus size={16} />, href: '#register' }
        ];
    }
  };

  const menuItems = getMenuItems(role);

  return (
    <div className="dropdown-box">
      {menuItems.map((item, index) => (
        <a key={index} href={item.href} className={`dropdown-row ${item.type === 'danger' ? 'danger' : ''}`}>
          <span className="row-icon">{item.icon}</span>{item.label}
        </a>
      ))}
    </div>
  );
};

export default Navbar;