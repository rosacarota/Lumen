import React, { useState } from 'react';
import Navbar from '../components/Navbar'; // Assicurati che il percorso sia corretto
import { Trash2, Search, MapPin, Briefcase, User } from 'lucide-react';
import Footer from '../components/Footer';

export default function VolontariEnte() {
  // --- DATI FITTIZI (In futuro arriveranno dal Backend) ---
  const [volontari, setVolontari] = useState([
    {
      id: 1,
      nome: "Mario",
      cognome: "Rossi",
      ambito: "Assistenza Anziani",
      immagine: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    {
      id: 2,
      nome: "Giulia",
      cognome: "Bianchi",
      ambito: "Distribuzione Pasti",
      immagine: null // Testiamo il caso senza immagine
    },
    {
      id: 3,
      nome: "Luca",
      cognome: "Verdi",
      ambito: "Supporto Digitale",
      immagine: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // --- LOGICA RIMOZIONE ---
  const handleRemove = (id) => {
    // 1. Qui in futuro farai: await fetch(`/api/ente/affiliati/${id}`, { method: 'DELETE' })
    const confirm = window.confirm("Sei sicuro di voler rimuovere questo volontario dai tuoi affiliati?");
    
    if (confirm) {
      // 2. Aggiornamento Ottimistico della UI
      const updatedList = volontari.filter(volontario => volontario.id !== id);
      setVolontari(updatedList);
    }
  };

  // Filtro per la barra di ricerca
  const filteredVolontari = volontari.filter(v => 
    v.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.cognome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.pageWrapper}>
      <Navbar />
      
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>I tuoi Affiliati</h1>
            <p style={styles.subtitle}>Gestisci il team di volontari che collabora con il tuo Ente.</p>
          </div>
          
          {/* Barra di Ricerca */}
          <div style={styles.searchWrapper}>
            <Search size={20} color="#087886" style={{ marginRight: '10px' }} />
            <input 
              type="text" 
              placeholder="Cerca volontario..." 
              style={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* LISTA VOLONTARI */}
        <div style={styles.listContainer}>
          {filteredVolontari.length > 0 ? (
            filteredVolontari.map((volontario) => (
              <div key={volontario.id} style={styles.card}>
                
                {/* 1. Immagine Profilo (Cerchio) */}
                <div style={styles.avatarContainer}>
                  {volontario.immagine ? (
                    <img src={volontario.immagine} alt={volontario.nome} style={styles.avatarImg} />
                  ) : (
                    <User size={24} color="#087886" />
                  )}
                </div>

                {/* 2. Dati Volontario */}
                <div style={styles.infoContainer}>
                  <h3 style={styles.nameText}>{volontario.nome} {volontario.cognome}</h3>
                  <div style={styles.badgesWrapper}>
                    <div style={styles.badge}>
                        <Briefcase size={14} style={{marginRight: 4}}/> {volontario.ambito}
                    </div>
                  </div>
                </div>

                {/* 3. Tasto Azione */}
                <button 
                  onClick={() => handleRemove(volontario.id)} 
                  style={styles.removeButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFF5F5';
                    e.currentTarget.style.borderColor = '#FF4444';
                    e.currentTarget.style.color = '#FF4444';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.color = '#6B7280';
                  }}
                >
                  <Trash2 size={18} style={{ marginRight: '5px' }} />
                  Rimuovi
                </button>

              </div>
            ))
          ) : (
            <div style={styles.emptyState}>
              <p>Nessun volontario trovato.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

// --- STILI CSS-IN-JS (Palette Lumen) ---
const styles = {
  pageWrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #F7FBFB 0%, #E9FBE7 100%)',
    // 1. RIMOSSO paddingBottom: '50px' (causava lo spazio bianco sotto il footer)
    // 2. AGGIUNTO Flexbox per gestire l'altezza
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 20px',
    width: '100%', // Assicura che il container occupi la larghezza disponibile
    // 3. AGGIUNTO flex: 1. Questo dice al container di "spingere" 
    // occupando tutto lo spazio disponibile verticale, spingendo il footer in basso.
    flex: 1, 
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#087886',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#6B7280',
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    padding: '12px 20px',
    borderRadius: '30px',
    boxShadow: '0 4px 15px rgba(8, 120, 134, 0.1)',
    border: '1px solid #E5E7EB',
    width: '300px'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    width: '100%',
    color: '#374151'
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    padding: '20px',
    borderRadius: '20px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  avatarContainer: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#E9FBE7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    border: '2px solid #087886',
    marginRight: '20px',
    flexShrink: 0
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  infoContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '6px'
  },
  badgesWrapper: {
    display: 'flex',
    gap: '10px'
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    backgroundColor: '#F0FDFA',
    color: '#087886',
    padding: '4px 10px',
    borderRadius: '12px',
    fontWeight: '500'
  },
  badgeSecondary: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    backgroundColor: '#F3F4F6', // Corretto typo precedente se c'era
    color: '#6B7280',
    padding: '4px 10px',
    borderRadius: '12px',
    fontWeight: '500'
  },
  removeButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px',
    background: 'transparent',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    color: '#6B7280',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    marginLeft: '20px'
  },
  emptyState: {
    textAlign: 'center',
    color: '#6B7280',
    padding: '40px',
    background: 'white',
    borderRadius: '20px',
    border: '1px dashed #E5E7EB'
  }
};