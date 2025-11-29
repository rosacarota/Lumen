import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Trash2, Search, MapPin, Briefcase, User, Loader2 } from 'lucide-react';
import AffiliazioneService from '../services/affiliazioneService'; // Assicurati del percorso corretto
import { useNavigate } from 'react-router-dom';

export default function VolontariEnte() {
  const [volontari, setVolontari] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  // 1. CARICAMENTO DATI DAL BACKEND
  useEffect(() => {
    const fetchAffiliati = async () => {
      try {
        const token = localStorage.getItem('token');

        // Chiama il service punto 6: getListaAffiliati
        const data = await AffiliazioneService.getListaAffiliati(token);
        
        // Assumo che il backend restituisca una lista di oggetti con i campi necessari
        // Se i nomi dei campi sono diversi (es. "nomeVolontario" invece di "nome"), adattali qui.
        setVolontari(data);
      } catch (err) {
        console.error("Errore caricamento affiliati:", err);
        setError("Impossibile caricare la lista degli affiliati.");
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliati();
  }, [navigate]);

  // 2. LOGICA RIMOZIONE (Punto 5 del Service: Rifiuta/Rimuovi)
  const handleRemove = async (idAffiliazione) => {
    const confirm = window.confirm("Sei sicuro di voler rimuovere questo volontario dai tuoi affiliati?");
    
    if (confirm) {
      try {
        const token = localStorage.getItem('token');
        
        // Chiama il service punto 5: rifiutaAffiliazione
        // NOTA: Assicurati che l'ID passato sia l'ID dell'Affiliazione, non del Volontario!
        // Il backend si aspetta "idAffiliazione".
        const responseMessage = await AffiliazioneService.rifiutaAffiliazione(idAffiliazione, token);
        
        alert(responseMessage); // Mostra messaggio di successo del backend

        // Aggiorna la lista rimuovendo l'elemento
        setVolontari(prev => prev.filter(v => v.idAffiliazione !== idAffiliazione));
        
      } catch (err) {
        alert("Errore durante la rimozione: " + err.message);
      }
    }
  };

  // 3. FILTRO RICERCA
  const filteredVolontari = volontari.filter(v => {
    // Adatta questi campi in base al JSON reale del tuo DTO
    const nomeCompleto = `${v.nome || ''} ${v.cognome || ''}`.toLowerCase();
    return nomeCompleto.includes(searchTerm.toLowerCase());
  });

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

        {/* CONTENUTO */}
        {loading ? (
          <div style={styles.loadingContainer}>
            <Loader2 className="animate-spin" size={40} color="#087886" />
            <p>Caricamento affiliati...</p>
          </div>
        ) : error ? (
          <div style={styles.errorContainer}>{error}</div>
        ) : (
          <div style={styles.listContainer}>
            {filteredVolontari.length > 0 ? (
              filteredVolontari.map((volontario) => (
                // Usa idAffiliazione come key se disponibile, altrimenti id
                <div key={volontario.idAffiliazione || volontario.id} style={styles.card}>
                  
                  {/* Avatar */}
                  <div style={styles.avatarContainer}>
                    {volontario.immagine ? (
                      <img src={volontario.immagine} alt={volontario.nome} style={styles.avatarImg} />
                    ) : (
                      <User size={24} color="#087886" />
                    )}
                  </div>

                  {/* Info */}
                  <div style={styles.infoContainer}>
                    <h3 style={styles.nameText}>{volontario.nome} {volontario.cognome}</h3>
                    <div style={styles.badgesWrapper}>
                      {volontario.ambito && (
                        <div style={styles.badge}>
                            <Briefcase size={14} style={{marginRight: 4}}/> {volontario.ambito}
                        </div>
                      )}
                      {volontario.citta && (
                        <div style={styles.badgeSecondary}>
                            <MapPin size={14} style={{marginRight: 4}}/> {volontario.citta}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tasto Rimuovi */}
                  <button 
                    // Importante: passa idAffiliazione qui
                    onClick={() => handleRemove(volontario.idAffiliazione)} 
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
        )}
      </div>
      <Footer />
    </div>
  );
}

// --- STILI (Invariati, aggiunto solo loadingContainer) ---
const styles = {
  pageWrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #F7FBFB 0%, #E9FBE7 100%)',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 20px',
    width: '100%',
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
  title: { fontSize: '32px', fontWeight: '700', color: '#087886', marginBottom: '8px' },
  subtitle: { fontSize: '16px', color: '#6B7280' },
  searchWrapper: {
    display: 'flex', alignItems: 'center', background: 'white', padding: '12px 20px',
    borderRadius: '30px', boxShadow: '0 4px 15px rgba(8, 120, 134, 0.1)',
    border: '1px solid #E5E7EB', width: '300px'
  },
  searchInput: { border: 'none', outline: 'none', fontSize: '14px', width: '100%', color: '#374151' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: {
    display: 'flex', alignItems: 'center', background: 'white', padding: '20px',
    borderRadius: '20px', border: '1px solid #E5E7EB',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)', transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  avatarContainer: {
    width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#E9FBE7',
    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    border: '2px solid #087886', marginRight: '20px', flexShrink: 0
  },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  infoContainer: { flex: 1 },
  nameText: { fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '6px' },
  badgesWrapper: { display: 'flex', gap: '10px' },
  badge: { display: 'flex', alignItems: 'center', fontSize: '12px', backgroundColor: '#F0FDFA', color: '#087886', padding: '4px 10px', borderRadius: '12px', fontWeight: '500' },
  badgeSecondary: { display: 'flex', alignItems: 'center', fontSize: '12px', backgroundColor: '#F3F4F6', color: '#6B7280', padding: '4px 10px', borderRadius: '12px', fontWeight: '500' },
  removeButton: {
    display: 'flex', alignItems: 'center', padding: '10px 16px', background: 'transparent',
    border: '1px solid #E5E7EB', borderRadius: '12px', color: '#6B7280', cursor: 'pointer',
    fontSize: '14px', fontWeight: '500', transition: 'all 0.3s ease', marginLeft: '20px'
  },
  emptyState: { textAlign: 'center', color: '#6B7280', padding: '40px', background: 'white', borderRadius: '20px', border: '1px dashed #E5E7EB' },
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#087886' },
  errorContainer: { textAlign: 'center', color: '#FF4444', padding: '20px', background: '#FFF5F5', borderRadius: '10px' }
};