import { useState, useRef } from 'react';
// Aggiungi useNavigate per il reindirizzamento
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Building2, Heart, Users, HeartHandshake, Pencil, Camera } from 'lucide-react';
import { registerUser, loginUser } from '../services/loginService';
import { validateRegistration } from '../utils/loginValidation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../stylesheets/LoginPage.css';

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
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
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
        <div className="input-group">
          <Mail className="input-icon" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="input-field" />
        </div>
        <div className="input-group">
          <Lock className="input-icon" />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="input-field" />
        </div>
        <div className="input-group">
          <Lock className="input-icon" />
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Conferma Password" className="input-field" />
        </div>
      </>
    );

    if (userType === 'ente') {
      return (
        <div className="fields-container">
          <div className="input-group">
            <Building2 className="input-icon" />
            <input type="text" name="nomeEnte" value={formData.nomeEnte} onChange={handleChange} placeholder="Nome Ente" className="input-field" />
          </div>
          <div className="input-group">
            <User className="input-icon" />
            <input type="text" name="referente" value={formData.referente} onChange={handleChange} placeholder="Referente" className="input-field" />
          </div>
          <div className="input-group">
            <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Telefono" className="input-field-no-icon" />
          </div>
          {commonFields}
        </div>
      );
    }

    return (
      <div className="fields-container">
        <div className="input-group">
          <User className="input-icon" />
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome" className="input-field" />
        </div>
        <div className="input-group">
          <User className="input-icon" />
          <input type="text" name="cognome" value={formData.cognome} onChange={handleChange} placeholder="Cognome" className="input-field" />
        </div>
        <div className="input-group">
          <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Telefono" className="input-field-no-icon" />
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
      <div className="login-page">
        <div className="login-container" style={{ height: (!isLogin && userType) ? '800px' : '700px' }}>

          {/* GRADIENT PANEL */}
          <div className="gradient-panel" style={{ transform: isSwapped ? 'translateX(100%)' : 'translateX(0%)' }}>
            <div className="gradient-overlay"></div>
            <div className="blur-circle-1"></div>
            <div className="blur-circle-2"></div>
            <div className="welcome-content" key={`${isLogin}-${step}-${userType}`}>
              <h1 className="welcome-title">{welcomeMsg.title}</h1>
              <p className="welcome-subtitle">{welcomeMsg.subtitle}</p>
              <div className="welcome-footer">
                {welcomeMsg.footer}{' '}
                {step === 2 ? (
                  <button onClick={() => setStep(1)} className="link-button">Torna indietro</button>
                ) : (
                  <button onClick={() => { setIsLogin(!isLogin); setUserType(null); setStep(1); }} className="link-button">
                    {isLogin ? 'Iscriviti ora' : 'Accedi'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* FORM PANEL */}
          <div className="form-panel hide-scrollbar" style={{ transform: isSwapped ? 'translateX(-100%)' : 'translateX(0%)' }}>
            <div className="form-container">
              <div className="logo-section">
                <div className="logo-wrapper">
                  <HeartHandshake className="logo-icon" />
                  <span className="logo-text">Lumen</span>
                </div>
                <p className="logo-subtitle">Insieme, per un futuro luminoso</p>
              </div>

              <div className="form-content">
                {/* CASO 1: SELEZIONE UTENTE CON ANIMAZIONE SLIDE IN */}
                {!isLogin && !userType ? (
                  <div className="user-type-selection">
                    <h2 className="form-title">Che tipo di utente sei?</h2>
                    {['ente', 'volontario', 'beneficiario'].map((type, index) => (
                      <button key={type}
                        onClick={() => handleUserTypeSelection(type)}
                        className="user-type-card"
                        style={{
                          animation: `slideInFromLeft 0.5s ease-out forwards`,
                          animationDelay: `${index * 0.40}s`,
                          opacity: 0
                        }}>
                        <div className="user-type-icon-wrapper">
                          {type === 'ente' ? <Building2 className="user-type-icon" /> : type === 'volontario' ? <Heart className="user-type-icon" /> : <Users className="user-type-icon" />}
                        </div>
                        <div className="user-type-info">
                          <div className="user-type-name">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                          <div className="user-type-desc">{type === 'ente' ? 'Organizzazione o associazione' : type === 'volontario' ? 'Voglio offrire il mio tempo' : 'Ho bisogno di supporto'}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  // CASO 2: STEP 1
                ) : !isLogin && userType && step === 1 ? (
                  <div className="registration-form">
                    <button onClick={() => setUserType(null)} className="back-button">← Indietro</button>
                    <h2 className="form-title">Registrazione {userType.charAt(0).toUpperCase() + userType.slice(1)}</h2>
                    {renderRegistrationFields()}
                    <button onClick={handleNextStep} className="submit-button">CONTINUA</button>
                  </div>

                  // CASO 3: STEP 2 (CONOSCIAMOCI MEGLIO)
                ) : !isLogin && userType && step === 2 ? (
                  <div className="registration-form">
                    <h2 className="form-title">Conosciamoci meglio</h2>

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

                    <div className="fields-container">

                      {/* AMBITO SOLO SE ENTE O VOLONTARIO */}
                      {(userType === 'ente' || userType === 'volontario') && (
                        <div className="input-group">
                          <input type="text" name="ambito" value={formData.ambito} onChange={handleChange} placeholder="Ambito (es. Sociale)" className="input-field-no-icon" />
                        </div>
                      )}

                      <div className="input-group">
                        <textarea name="descrizione" value={formData.descrizione} onChange={handleChange} placeholder="Descrizione / Bio" className="textarea-field" rows="3" />
                      </div>

                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#087886', marginTop: '10px' }}>Indirizzo (Opzionale)</div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" name="strada" value={formData.strada} onChange={handleChange} placeholder="Via/Piazza" className="input-field-no-icon" style={{ flex: 2 }} />
                        <input type="text" name="nCivico" value={formData.nCivico} onChange={handleChange} placeholder="N." className="input-field-no-icon" style={{ flex: 1 }} />
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" name="citta" value={formData.citta} onChange={handleChange} placeholder="Città" className="input-field-no-icon" />
                        <input type="text" name="cap" value={formData.cap} onChange={handleChange} placeholder="CAP" className="input-field-no-icon" />
                      </div>
                      <input type="text" name="provincia" value={formData.provincia} onChange={handleChange} placeholder="Provincia (es. MI)" className="input-field-no-icon" />

                      <button onClick={handleSubmit} className="submit-button">COMPLETA REGISTRAZIONE</button>
                    </div>
                    <button onClick={() => setStep(1)} className="back-button mobile-only">← Indietro</button>
                  </div>

                  // CASO 4: LOGIN
                ) : (
                  <div className="login-form">
                    <div className="avatar-wrapper">
                      <User className="avatar-icon" />
                    </div>
                    <div className="fields-container">
                      <div className="input-group">
                        <User className="input-icon" />
                        <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="USERNAME" className="input-field" />
                      </div>
                      <div className="input-group">
                        <Lock className="input-icon" />
                        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="PASSWORD" className="input-field" />
                      </div>
                    </div>
                    <button onClick={handleSubmit} className="submit-button">LOGIN</button>
                    <div className="login-options">
                      <label className="remember-me">
                        <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="checkbox" /> Ricordami
                      </label>
                      <button className="forgot-password">Password dimenticata?</button>
                    </div>
                  </div>
                )}

                {/* Punti */}
                {!isLogin && (
                  <div className="dots-indicator">
                    <span className={!userType ? "dot-active" : "dot"}></span>
                    <span className={userType && step === 1 ? "dot-active" : "dot"}></span>
                    <span className={step === 2 ? "dot-active" : "dot"}></span>
                  </div>
                )}

                {/* Toggle */}
                <div className="toggle-form">
                  {isLogin ? (
                    <>Non hai un account? <button onClick={() => { setIsLogin(false); setUserType(null); setStep(1); }} className="toggle-button">Registrati ora</button></>
                  ) : !userType ? (
                    <>Hai già un account? <button onClick={() => { setIsLogin(true); setUserType(null); setStep(1); }} className="toggle-button">Accedi</button></>
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
