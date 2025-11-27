import React from 'react';
import { Link } from 'react-router-dom';
import '../stylesheets/Footer.css';

const Footer = () => {
  return (
    <footer className="footer-minimal">
      <div className="footer-content">

        <div className="footer-brand">
          <div className="brand-group">
            <div className="logo-circle-mini">
              <span>L</span>
            </div>
            <span className="brand-name">Lumen</span>
          </div>
          <span className="copyright">
            © {new Date().getFullYear()} - Tutti i diritti riservati.
          </span>
        </div>

        <nav className="footer-nav">
          <Link to="/chisiamo">Chi siamo</Link>
          <Link to="/storie">Storie</Link>
          <Link to="/eventi">Eventi</Link>
        </nav>

      </div>
    </footer>
  );
};

export default Footer;