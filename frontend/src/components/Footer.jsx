import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
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
          <a href="#chi-siamo">Chi Siamo</a>
          <a href="#storie">Storie</a>
          <a href="#eventi">Eventi</a>
        </nav>

      </div>
    </footer>
  );
};

export default Footer;