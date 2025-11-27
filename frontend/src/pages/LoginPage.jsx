import { useState, useRef } from 'react';
// Aggiungi useNavigate per il reindirizzamento
import { useNavigate } from 'react-router-dom'; 
import { User, Lock, Mail, Building2, Heart, Users, HeartHandshake, Pencil, Camera } from 'lucide-react';
import { registerUser, loginUser } from '../services/loginService';
import { validateRegistration } from '../utils/loginValidation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LoginPage() {

  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [step, setStep] = useState(1);
  const fileInputRef = useRef(null);
  
  // Hook per la navigazione
  const navigate = useNavigate();

  // STATO COMPLETO
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nome: '',      
    cognome: '',    
    nomeEnte: '',   
    referente: '', 
    telefono: '',   
    descrizione: '', 
    ambito: '',
    immagineBase64: null, 
    citta: '',
    provincia: '',
    cap: '',
    strada: '',
    nCivico: '',
    ruolo: '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, immagineBase64: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUserTypeSelection = (type) => {
    setUserType(type);
    const formattedRole = type.charAt(0).toUpperCase() + type.slice(1);
    setFormData(prev => ({ ...prev, ruolo: formattedRole }));
  };

  const handleSubmit = async () => {
    if (isLogin) {
      // --- LOGICA LOGIN ---
      try {
        const resultMessage = await loginUser({ email: formData.email, password: formData.password });
        console.log(resultMessage); 
        navigate('/home'); 
      } catch (error) {
        alert("Errore Login: " + error.message);
      }
    } else {
      // --- REGISTRAZIONE ---
      const validation = validateRegistration(formData);
      if (!validation.isValid) {
        alert(Object.values(validation.errors)[0]);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert("Le password non coincidono!");
        return;
      }

      const hasAddress = formData.citta || formData.strada;
      const indirizzoObj = hasAddress ? {
          citta: formData.citta || "",
          provincia: formData.provincia || "",
          cap: formData.cap || "",
          strada: formData.strada || "",
          nCivico: formData.nCivico ? parseInt(formData.nCivico) : null
      } : null;

      let finalNome = formData.nome;
      let finalCognome = formData.cognome;

      if (userType === 'ente') {
          finalNome = formData.nomeEnte;
          finalCognome = null; 
      }

      let finalAmbito = formData.ambito;
      if (userType === 'beneficiario') {
          finalAmbito = null;
      }

      const payload = {
          email: formData.email,
          nome: finalNome,
          cognome: finalCognome, 
          password: formData.password,
          descrizione: formData.descrizione || null,
          recapitoTelefonico: formData.telefono, 
          ruolo: formData.ruolo,
          ambito: finalAmbito || null,
          immagine: formData.immagineBase64 || null,
          indirizzo: indirizzoObj
      };

      try {
        await registerUser(payload);
        alert("Registrazione completata! Effettua il login.");
        setIsLogin(true);
        setStep(1);
        setUserType(null);
        setFormData(prev => ({...prev, password: '', confirmPassword: ''}));
      } catch (error) {
        alert("Errore registrazione: " + error.message);
      }
    }
  };

  const handleNextStep = () => {
    if (!formData.email || !formData.password) {
        alert("Compila email e password per proseguire.");
        return;
    }
    setStep(2);
  };

  const renderRegistrationFields = () => {
    const commonFields = (
      <>
        <div style={styles.inputGroup}>
          <Mail style={styles.inputIcon} />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" style={styles.inputField} onFocus={(e) => { e.target.style.borderColor = '#4AAFB8'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 175, 184, 0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }} />
        </div>
        <div style={styles.inputGroup}>
          <Lock style={styles.inputIcon} />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" style={styles.inputField} onFocus={(e) => { e.target.style.borderColor = '#4AAFB8'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 175, 184, 0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }} />
        </div>
        <div style={styles.inputGroup}>
          <Lock style={styles.inputIcon} />
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Conferma Password" style={styles.inputField} onFocus={(e) => { e.target.style.borderColor = '#4AAFB8'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 175, 184, 0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }} />
        </div>
      </>
    );

    if (userType === 'ente') {
        return (
          <div style={styles.fieldsContainer}>
            <div style={styles.inputGroup}>
              <Building2 style={styles.inputIcon} />
              <input type="text" name="nomeEnte" value={formData.nomeEnte} onChange={handleChange} placeholder="Nome Ente" style={styles.inputField} onFocus={(e) => { e.target.style.borderColor = '#4AAFB8'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 175, 184, 0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }} />
            </div>
            <div style={styles.inputGroup}>
              <User style={styles.inputIcon} />
              <input type="text" name="referente" value={formData.referente} onChange={handleChange} placeholder="Referente" style={styles.inputField} onFocus={(e) => { e.target.style.borderColor = '#4AAFB8'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 175, 184, 0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }} />
            </div>
            <div style={styles.inputGroup}>
              <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Telefono" style={styles.inputFieldNoIcon} onFocus={(e) => { e.target.style.borderColor = '#4AAFB8'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 175, 184, 0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }} />
            </div>
            {commonFields}
          </div>
        );
    }
    
    return (
        <div style={styles.fieldsContainer}>
        <div style={styles.inputGroup}>
            <User style={styles.inputIcon} />
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome" style={styles.inputField} onFocus={(e) => { e.target.style.borderColor = '#4AAFB8'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 175, 184, 0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }} />
        </div>
        <div style={styles.inputGroup}>
            <User style={styles.inputIcon} />
            <input type="text" name="cognome" value={formData.cognome} onChange={handleChange} placeholder="Cognome" style={styles.inputField} onFocus={(e) => { e.target.style.borderColor = '#4AAFB8'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 175, 184, 0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }} />
        </div>
        <div style={styles.inputGroup}>
            <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Telefono" style={styles.inputFieldNoIcon} onFocus={(e) => { e.target.style.borderColor = '#4AAFB8'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 175, 184, 0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }} />
        </div>
        {commonFields}
        </div>
    );
  };

  const getWelcomeMessage = () => {
    if (isLogin) return { title: "Benvenuto.", subtitle: "Unisciti alla nostra community di volontari e fai la differenza nella tua comunità.", footer: "Non hai un account?" };
    if (step === 2) return { title: "Conosciamoci meglio.", subtitle: "Ultimi dettagli per personalizzare la tua esperienza. Sei a un passo dal traguardo.", footer: "Vuoi tornare indietro?" };
    if (!userType) return { title: "Il primo passo.", subtitle: "Scegli il tipo di profilo più adatto a te e inizia il tuo viaggio nel mondo del volontariato.", footer: "Hai già un account?" };
    if (step === 1) return { title: "Ci siamo quasi.", subtitle: "Completa la registrazione e diventa parte della nostra community. Insieme possiamo fare la differenza.", footer: "Hai già un account?" };
    return { title: "", subtitle: "", footer: "" };
  };

  const welcomeMsg = getWelcomeMessage();
  const isSwapped = !isLogin && step !== 2;

  return ( 
    <>
    <Navbar />
    <div style={styles.loginPage}>
      <style>{keyframes}</style>
      <div style={{ ...styles.container, height: (!isLogin && userType) ? '800px' : '700px' }}>
        
        {/* GRADIENT PANEL */}
        <div style={{ ...styles.gradientPanel, transform: isSwapped ? 'translateX(100%)' : 'translateX(0%)' }}>
          <div style={styles.gradientOverlay}></div>
          <div style={styles.blurCircle1}></div>
          <div style={styles.blurCircle2}></div>
          <div style={styles.welcomeContent} key={`${isLogin}-${step}-${userType}`}>
            <h1 style={styles.welcomeTitle}>{welcomeMsg.title}</h1>
            <p style={styles.welcomeSubtitle}>{welcomeMsg.subtitle}</p>
            <div style={styles.welcomeFooter}>
              {welcomeMsg.footer}{' '}
              {step === 2 ? (
                 <button onClick={() => setStep(1)} style={styles.linkButton} onMouseEnter={(e) => e.target.style.opacity = '0.8'} onMouseLeave={(e) => e.target.style.opacity = '1'}>Torna indietro</button>
              ) : (
                <button onClick={() => { setIsLogin(!isLogin); setUserType(null); setStep(1); }} style={styles.linkButton} onMouseEnter={(e) => e.target.style.opacity = '0.8'} onMouseLeave={(e) => e.target.style.opacity = '1'}>
                  {isLogin ? 'Iscriviti ora' : 'Accedi'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* FORM PANEL */}
        <div className="hide-scrollbar" style={{ ...styles.formPanel, transform: isSwapped ? 'translateX(-100%)' : 'translateX(0%)' }}>
          <div style={styles.formContainer}>
            <div style={styles.logoSection}>
              <div style={styles.logoWrapper}>
                <HeartHandshake style={styles.logoIcon} />
                <span style={styles.logoText}>Lumen</span>
              </div>
              <p style={styles.logoSubtitle}>Insieme, per un futuro luminoso</p>
            </div>

            <div style={styles.formContent}>
              {/* CASO 1: SELEZIONE UTENTE CON ANIMAZIONE SLIDE IN */}
              {!isLogin && !userType ? (
                <div style={styles.userTypeSelection}>
                  <h2 style={styles.formTitle}>Che tipo di utente sei?</h2>
                  {['ente', 'volontario', 'beneficiario'].map((type, index) => ( // AGGIUNTO index
                      <button key={type} 
                        onClick={() => handleUserTypeSelection(type)} 
                        style={{
                            ...styles.userTypeCard,
                            // AGGIUNTA ANIMAZIONE DINAMICA
                            animation: `slideInFromLeft 0.5s ease-out forwards`,
                            animationDelay: `${index * 0.40}s`, // Delay scalato per ogni card
                            opacity: 0 // Parte invisibile
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#4AAFB8'; e.currentTarget.style.background = '#E9FBE7'; e.currentTarget.querySelector('.icon-wrapper').style.background = '#7CCE6B'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = 'white'; e.currentTarget.querySelector('.icon-wrapper').style.background = '#E9FBE7'; }}>
                        <div className="icon-wrapper" style={styles.userTypeIconWrapper}>
                          {type === 'ente' ? <Building2 style={styles.userTypeIcon} /> : type === 'volontario' ? <Heart style={styles.userTypeIcon} /> : <Users style={styles.userTypeIcon} />}
                        </div>
                        <div style={styles.userTypeInfo}>
                          <div style={styles.userTypeName}>{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                          <div style={styles.userTypeDesc}>{type === 'ente' ? 'Organizzazione o associazione' : type === 'volontario' ? 'Voglio offrire il mio tempo' : 'Ho bisogno di supporto'}</div>
                        </div>
                      </button>
                  ))}
                </div>

              // CASO 2: STEP 1
              ) : !isLogin && userType && step === 1 ? (
                <div style={styles.registrationForm}>
                  <button onClick={() => setUserType(null)} style={styles.backButton}>← Indietro</button>
                  <h2 style={styles.formTitle}>Registrazione {userType.charAt(0).toUpperCase() + userType.slice(1)}</h2>
                  {renderRegistrationFields()}
                  <button onClick={handleNextStep} style={styles.submitButton}>CONTINUA</button>
                </div>

              // CASO 3: STEP 2 (CONOSCIAMOCI MEGLIO)
              ) : !isLogin && userType && step === 2 ? (
                <div style={styles.registrationForm}>
                  <h2 style={styles.formTitle}>Conosciamoci meglio</h2>
                  
                  {/* UPLOAD */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', position: 'relative' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #E5E7EB', position: 'relative' }}>
                         {formData.immagineBase64 ? (
                            <img src={formData.immagineBase64} alt="Preview" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                         ) : (
                            <Camera size={40} color="#9CA3AF" />
                         )}
                         <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
                         <button onClick={() => fileInputRef.current.click()} style={{ position: 'absolute', bottom: 0, right: 0, background: '#087886', border: '2px solid white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Pencil size={16} color="white" />
                         </button>
                    </div>
                  </div>

                  <div style={styles.fieldsContainer}>
                      
                     {/* AMBITO SOLO SE ENTE O VOLONTARIO */}
                     {(userType === 'ente' || userType === 'volontario') && (
                        <div style={styles.inputGroup}>
                           <input type="text" name="ambito" value={formData.ambito} onChange={handleChange} placeholder="Ambito (es. Sociale)" style={styles.inputFieldNoIcon} />
                        </div>
                     )}

                     <div style={styles.inputGroup}>
                        <textarea name="descrizione" value={formData.descrizione} onChange={handleChange} placeholder="Descrizione / Bio" style={styles.textareaField} rows="3" />
                     </div>
                     
                     <div style={{ fontSize: '14px', fontWeight: '600', color: '#087886', marginTop: '10px' }}>Indirizzo (Opzionale)</div>
                     
                     <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" name="strada" value={formData.strada} onChange={handleChange} placeholder="Via/Piazza" style={{ ...styles.inputFieldNoIcon, flex: 2 }} />
                        <input type="text" name="nCivico" value={formData.nCivico} onChange={handleChange} placeholder="N." style={{ ...styles.inputFieldNoIcon, flex: 1 }} />
                     </div>
                     <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" name="citta" value={formData.citta} onChange={handleChange} placeholder="Città" style={styles.inputFieldNoIcon} />
                        <input type="text" name="cap" value={formData.cap} onChange={handleChange} placeholder="CAP" style={styles.inputFieldNoIcon} />
                     </div>
                     <input type="text" name="provincia" value={formData.provincia} onChange={handleChange} placeholder="Provincia (es. MI)" style={styles.inputFieldNoIcon} />
                     
                     <button onClick={handleSubmit} style={styles.submitButton}>COMPLETA REGISTRAZIONE</button>
                  </div>
                </div>

              // CASO 4: LOGIN
              ) : (
                <div style={styles.loginForm}>
                  <div style={styles.avatarWrapper}>
                    <User style={styles.avatarIcon} />
                  </div>
                  <div style={styles.fieldsContainer}>
                    <div style={styles.inputGroup}>
                      <User style={styles.inputIcon} />
                      <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="USERNAME" style={styles.inputField} onFocus={(e) => { e.target.style.borderColor = '#4AAFB8'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 175, 184, 0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }} />
                    </div>
                    <div style={styles.inputGroup}>
                      <Lock style={styles.inputIcon} />
                      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="PASSWORD" style={styles.inputField} onFocus={(e) => { e.target.style.borderColor = '#4AAFB8'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 175, 184, 0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }} />
                    </div>
                  </div>
                  <button onClick={handleSubmit} style={styles.submitButton} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(8, 120, 134, 0.4)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 12px rgba(8, 120, 134, 0.3)'; }}>LOGIN</button>
                  <div style={styles.loginOptions}>
                    <label style={styles.rememberMe}>
                      <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} style={styles.checkbox} /> Ricordami
                    </label>
                    <button style={styles.forgotPassword} onMouseEnter={(e) => e.target.style.color = '#4AAFB8'} onMouseLeave={(e) => e.target.style.color = '#6B7280'}>Password dimenticata?</button>
                  </div>
                </div>
              )}

              {/* Punti */}
              {!isLogin && (
                <div style={styles.dotsIndicator}>
                  <span style={!userType ? styles.dotActive : styles.dot}></span>
                  <span style={userType && step === 1 ? styles.dotActive : styles.dot}></span>
                  <span style={step === 2 ? styles.dotActive : styles.dot}></span>
                </div>
              )}

              {/* Toggle */}
              <div style={styles.toggleForm}>
                {isLogin ? (
                  <>Non hai un account? <button onClick={() => { setIsLogin(false); setUserType(null); setStep(1); }} style={styles.toggleButton}>Registrati ora</button></>
                ) : !userType ? (
                  <>Hai già un account? <button onClick={() => { setIsLogin(true); setUserType(null); setStep(1); }} style={styles.toggleButton}>Accedi</button></>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

// AGGIUNTA KEYFRAME slideInFromLeft
const keyframes = `
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  
  /* Nuova animazione Slide In da Sinistra */
  @keyframes slideInFromLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }
`;

const styles = {
  loginPage: { flex: 1, background: 'linear-gradient(135deg, #F7FBFB 0%, #E9FBE7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '46px', overflow: 'hidden' },
  container: { width: '100%', maxWidth: '1200px', display: 'flex', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(8, 120, 134, 0.15)', background: 'white', position: 'relative', transition: 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1)' },
  gradientPanel: { position: 'absolute', width: '50%', height: '100%', left: 0, top: 0, background: 'linear-gradient(135deg, #087886 0%, #4AAFB8 50%, #7CCE6B 100%)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 2 },
  formPanel: { position: 'absolute', width: '50%', height: '100%', right: 0, top: 0, background: 'white', padding: '20px 60px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 1, overflowY: 'auto' },
  gradientOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(8, 120, 134, 0.8) 0%, rgba(74, 175, 184, 0.6) 50%, rgba(124, 206, 107, 0.4) 100%)' },
  blurCircle1: { position: 'absolute', width: '300px', height: '300px', background: '#7CCE6B', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.5, top: '10%', left: '10%', animation: 'pulse 4s ease-in-out infinite' },
  blurCircle2: { position: 'absolute', width: '400px', height: '400px', background: '#4AAFB8', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.5, bottom: '10%', right: '10%', animation: 'pulse 5s ease-in-out infinite' },
  welcomeContent: { position: 'relative', zIndex: 10, color: 'white', textAlign: 'center', animation: 'fadeInUp 0.6s ease-out' },
  welcomeTitle: { fontSize: '56px', fontWeight: 700, marginBottom: '24px', textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)' },
  welcomeSubtitle: { fontSize: '18px', lineHeight: 1.6, opacity: 0.95, marginBottom: '32px' },
  welcomeFooter: { fontSize: '14px', opacity: 0.9 },
  linkButton: { background: 'none', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontSize: '14px', transition: 'opacity 0.3s ease' },
  forgotPassword: { background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '14px', transition: 'color 0.3s ease' },
  userTypeSelection: { display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' },
  userTypeCard: { width: '100%', padding: '16px', background: 'white', border: '2px solid #E5E7EB', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s ease' },
  userTypeIconWrapper: { width: '48px', height: '48px', borderRadius: '50%', background: '#E9FBE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s ease' },
  userTypeIcon: { width: '24px', height: '24px', color: '#087886' },
  userTypeInfo: { flex: 1 },
  userTypeName: { fontWeight: 600, color: '#087886', marginBottom: '4px' },
  userTypeDesc: { fontSize: '14px', color: '#6B7280' },
  backButton: { background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '14px', marginBottom: '16px', transition: 'color 0.3s ease' },
  toggleForm: { textAlign: 'center', fontSize: '14px', color: '#6B7280', paddingTop: '16px' },
  toggleButton: { background: 'none', border: 'none', color: '#087886', fontWeight: 600, cursor: 'pointer', fontSize: '14px', transition: 'color 0.3s ease' },
  registrationForm: { display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' },
  loginForm: { display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' },
  textareaField: { width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB', borderRadius: '20px', fontSize: '14px', outline: 'none', transition: 'all 0.3s ease', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' },
  formContainer: { width: '100%', maxWidth: '420px' },
  logoSection: { marginBottom: '30px', marginTop: '50px' },
  logoWrapper: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
  logoIcon: { width: '32px', height: '32px', color: '#087886' },
  logoText: { fontSize: '24px', fontWeight: 700, color: '#087886' },
  logoSubtitle: { fontSize: '14px', color: '#6B7280' },
  formContent: { display: 'flex', flexDirection: 'column', gap: '24px' },
  formTitle: { fontSize: '24px', fontWeight: 600, color: '#087886', marginBottom: '24px' },
  avatarWrapper: { width: '80px', height: '80px', borderRadius: '50%', border: '4px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' },
  avatarIcon: { width: '40px', height: '40px', color: '#9CA3AF' },
  fieldsContainer: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { position: 'relative' },
  inputIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#9CA3AF', pointerEvents: 'none' },
  inputField: { width: '100%', padding: '12px 16px 12px 44px', border: '2px solid #E5E7EB', borderRadius: '25px', fontSize: '14px', outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box' },
  inputFieldNoIcon: { width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB', borderRadius: '25px', fontSize: '14px', outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box' },
  submitButton: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #087886 0%, #7CCE6B 120%)', color: 'white', border: 'none', borderRadius: '25px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(8, 120, 134, 0.3)', transition: 'all 0.3s ease' },
  loginOptions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' },
  rememberMe: { display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280', cursor: 'pointer' },
  checkbox: { width: '16px', height: '16px', cursor: 'pointer' },
  dotsIndicator: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px 0' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', background: '#E5E7EB', transition: 'background 0.3s ease' },
  dotActive: { width: '8px', height: '8px', borderRadius: '50%', background: '#087886' },
};