import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Building2, Heart, Users, HeartHandshake, Pencil, Camera, Eye, EyeOff, Phone, AlertCircle } from 'lucide-react';
import { registerUser, loginUser } from '../services/loginService';
import { validateForm } from '../utils/loginValidation';

import '../stylesheets/LoginPage.css';

export default function LoginPage() {

  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [step, setStep] = useState(1);
  const fileInputRef = useRef(null);

  // Visibilità Password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Gestione Errori
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(""); // Per errori generali (es. Login fallito)

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nome: '',
    cognome: '',
    nomeEnte: '',
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

  // Reset errori quando l'utente digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Rimuovi l'errore specifico del campo se esiste
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    // Rimuovi errore API generale se l'utente prova a correggere
    if (apiError) setApiError("");
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
    setErrors({}); // Pulisci errori precedenti
    setApiError("");
  };

  // Helper per lo stile condizionale degli input (classe has-error)
  const getInputClassName = (fieldName) => {
    return errors[fieldName] ? 'input-field has-error' : 'input-field';
  };

  const getInputNoIconClassName = (fieldName) => {
    return errors[fieldName] ? 'input-field-no-icon has-error' : 'input-field-no-icon';
  };

  // Gestione Next Step (Step 1 -> Step 2)
  const handleNextStep = () => {
    const validation = validateForm(formData, false, userType, 1);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setStep(2);
    setErrors({});
  };

  // Gestione Submit Finale (Login o Registrazione)
  const handleSubmit = async () => {
    setApiError(""); // Reset errori API

    if (isLogin) {
      // --- LOGIN ---
      const validation = validateForm(formData, true, null, null);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      try {
        await loginUser({ email: formData.email, password: formData.password });
        navigate('/home');
      } catch (error) {
        // Mostra errore API nel box rosso sopra
        setApiError(error.message || "Credenziali non valide");
      }

    } else {
      // --- REGISTRAZIONE ---
      // Validiamo lo step corrente (Step 2) o tutto se necessario
      const validation = validateForm(formData, false, userType, 2);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      // Preparazione Payload
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
      if (userType === 'beneficiario') finalAmbito = null;

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
        // Reset e cambio stato
        setIsLogin(true);
        setStep(1);
        setUserType(null);
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        setApiError("");
      } catch (error) {
        setApiError(error.message || "Errore durante la registrazione");
      }
    }
  };

  // Helper per renderizzare errori sotto i campi
  const ErrorMsg = ({ field }) => errors[field] ? <span className="error-text">{errors[field]}</span> : null;

  const renderRegistrationFields = () => {
    const commonFields = (
      <>
        <div className="input-group-container">
          <div className="input-group">
            <Mail className="input-icon" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={getInputClassName('email')}
            />
          </div>
          <ErrorMsg field="email" />
        </div>

        <div className="input-group-container">
          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={getInputClassName('password')}
              style={{ paddingRight: '40px' }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <ErrorMsg field="password" />
        </div>

        <div className="input-group-container">
          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Conferma Password"
              className={getInputClassName('confirmPassword')}
              style={{ paddingRight: '40px' }}
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="password-toggle">
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <ErrorMsg field="confirmPassword" />
        </div>
      </>
    );

    if (userType === 'ente') {
      return (
        <div className="fields-container">
          <div className="input-group-container">
            <div className="input-group">
              <Building2 className="input-icon" />
              <input
                type="text"
                name="nomeEnte"
                value={formData.nomeEnte}
                onChange={handleChange}
                placeholder="Nome Ente"
                className={getInputClassName('nomeEnte')}
              />
            </div>
            <ErrorMsg field="nomeEnte" />
          </div>

          <div className="input-group-container">
            <div className="input-group">
              <Phone className="input-icon" />
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Telefono"
                className={getInputClassName('telefono')}
              />
            </div>
            <ErrorMsg field="telefono" />
          </div>
          {commonFields}
        </div>
      );
    }

    return (
      <div className="fields-container">
        <div className="input-group-container">
          <div className="input-group">
            <User className="input-icon" />
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Nome"
              className={getInputClassName('nome')}
            />
          </div>
          <ErrorMsg field="nome" />
        </div>

        <div className="input-group-container">
          <div className="input-group">
            <User className="input-icon" />
            <input
              type="text"
              name="cognome"
              value={formData.cognome}
              onChange={handleChange}
              placeholder="Cognome"
              className={getInputClassName('cognome')}
            />
          </div>
          <ErrorMsg field="cognome" />
        </div>

        <div className="input-group-container">
          <div className="input-group">
            <Phone className="input-icon" />
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Telefono"
              className={getInputClassName('telefono')}
            />
          </div>
          <ErrorMsg field="telefono" />
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
  const containerHeight = (!isLogin && userType) ? 'min(850px, 85vh)' : 'min(700px, 75vh)';

  return (
    <div className="login-page-wrapper">

      <div className="login-page">
        <div className="login-container hide-scrollbar" style={{ height: containerHeight }}>

          {/* GRADIENT PANEL */}
          <div className="gradient-panel" style={{ transform: isSwapped ? 'translateX(100%)' : 'translateX(0%)' }}>
            <div className="gradient-overlay"></div>
            <div className="blur-circle-0"></div>
            <div className="blur-circle-3"></div>
            <div className="welcome-content" key={`${isLogin}-${step}-${userType}`}>
              <h1 className="welcome-title1">{welcomeMsg.title}</h1>
              <p className="welcome-subtitle">{welcomeMsg.subtitle}</p>
              <div className="welcome-footer">
                {welcomeMsg.footer}{' '}
                {step === 2 ? (
                  <button onClick={() => setStep(1)} className="link-button">Torna indietro</button>
                ) : (
                  <button onClick={() => { setIsLogin(!isLogin); setUserType(null); setStep(1); setErrors({}); setApiError(""); }} className="link-button">
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

              {/* BOX ERRORI API */}
              {apiError && (
                <div className="api-error-box">
                  <AlertCircle size={18} />
                  <span>{apiError}</span>
                </div>
              )}

              <div className="form-content">

                {!isLogin && !userType ? (
                  <div className="user-type-selection">
                    <h2 className="form-title">Che tipo di utente sei?</h2>
                    {['ente', 'volontario', 'beneficiario'].map((type, index) => (
                      <button key={type}
                        onClick={() => handleUserTypeSelection(type)}
                        className="user-type-card"
                        style={{
                          animation: `slideInFromLeft 0.8s ease-out forwards`,
                          animationDelay: `${index * 0.30}s`,
                          opacity: 0
                        }}>
                        <div className="icon-wrapper user-type-icon-wrapper">
                          {type === 'ente' ? <Building2 className="user-type-icon" /> : type === 'volontario' ? <Heart className="user-type-icon" /> : <Users className="user-type-icon" />}
                        </div>
                        <div className="user-type-info">
                          <div className="user-type-name">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                          <div className="user-type-desc">{type === 'ente' ? 'Organizzazione o associazione' : type === 'volontario' ? 'Voglio offrire il mio tempo' : 'Ho bisogno di supporto'}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                ) : !isLogin && userType && step === 1 ? (
                  <div className="registration-form">
                    <button onClick={() => { setUserType(null); setErrors({}); setApiError(""); }} className="back-button">← Indietro</button>
                    <h2 className="form-title">Registrazione {userType.charAt(0).toUpperCase() + userType.slice(1)}</h2>
                    {renderRegistrationFields()}
                    <button onClick={handleNextStep} className="submit-button">CONTINUA</button>
                  </div>

                ) : !isLogin && userType && step === 2 ? (
                  <div className="registration-form">
                    <h2 className="form-title">Personalizzazione</h2>

                    <div className="image-upload-container">
                      <div className="image-preview-wrapper">
                        {formData.immagineBase64 ? (
                          <img src={formData.immagineBase64} alt="Preview" className="image-preview" />
                        ) : (
                          <Camera size={40} color="#9CA3AF" />
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
                        <button onClick={() => fileInputRef.current.click()} className="image-edit-button">
                          <Pencil size={16} color="white" />
                        </button>
                      </div>
                    </div>

                    <div className="fields-container">

                      {(userType === 'ente' || userType === 'volontario') && (
                        <div className="input-group-container">
                          <div className="input-group">
                            <input
                              type="text"
                              name="ambito"
                              value={formData.ambito}
                              onChange={handleChange}
                              placeholder="Di cosa ti occupi? (es. Sociale)"
                              className={getInputNoIconClassName('ambito')}
                            />
                          </div>
                        </div>
                      )}

                      <div className="input-group-container">
                        <div className="input-group">
                          <textarea
                            name="descrizione"
                            value={formData.descrizione}
                            onChange={handleChange}
                            placeholder="Parlaci di te / Bio"
                            className="textarea-field"
                            rows="3"
                          />
                        </div>
                      </div>

                      <div className="address-label">Indirizzo (Opzionale)</div>

                      <div className="address-row">
                        <input
                          type="text"
                          name="strada"
                          value={formData.strada}
                          onChange={handleChange}
                          placeholder="Via"
                          className={getInputNoIconClassName('strada')}
                          style={{ flex: 2 }}
                        />
                        <input
                          type="text"
                          name="nCivico"
                          value={formData.nCivico}
                          onChange={handleChange}
                          placeholder="N."
                          className={getInputNoIconClassName('nCivico')}
                          style={{ flex: 1 }}
                        />
                      </div>
                      <div className="address-row">
                        <input
                          type="text"
                          name="citta"
                          value={formData.citta}
                          onChange={handleChange}
                          placeholder="Città"
                          className="city-input"
                        />
                        <div className="cap-wrapper">
                          <input
                            type="text"
                            name="cap"
                            value={formData.cap}
                            onChange={handleChange}
                            placeholder="CAP"
                            className={getInputNoIconClassName('cap')}
                          />
                          <ErrorMsg field="cap" />
                        </div>
                      </div>
                      <input
                        type="text"
                        name="provincia"
                        value={formData.provincia}
                        onChange={handleChange}
                        placeholder="Provincia (es. MI)"
                        className={getInputNoIconClassName('provincia')}
                      />

                      <button onClick={handleSubmit} className="submit-button">COMPLETA REGISTRAZIONE</button>
                    </div>
                  </div>

                ) : (
                  <div className="login-form">
                    <div className="avatar-wrapper1">
                      <User className="avatar-icon" />
                    </div>
                    <div className="fields-container">
                      <div className="input-group-container">
                        <div className="input-group">
                          <User className="input-icon" />
                          <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="EMAIL"
                            className={getInputClassName('email')}
                          />
                        </div>
                        <ErrorMsg field="email" />
                      </div>

                      <div className="input-group-container">
                        <div className="input-group">
                          <Lock className="input-icon" />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="PASSWORD"
                            className={getInputClassName('password')}
                            style={{ paddingRight: '40px' }}
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                        <ErrorMsg field="password" />
                      </div>
                    </div>
                    <button onClick={handleSubmit} className="submit-button">LOGIN</button>

                  </div>
                )}

                {!isLogin && (
                  <div className="dots-indicator">
                    <span className={!userType ? 'dot-active' : 'dot'}></span>
                    <span className={userType && step === 1 ? 'dot-active' : 'dot'}></span>
                    <span className={step === 2 ? 'dot-active' : 'dot'}></span>
                  </div>
                )}

                <div className="toggle-form">
                  {isLogin ? (
                    <>Non hai un account? <button onClick={() => { setIsLogin(false); setUserType(null); setStep(1); setErrors({}); setApiError(""); }} className="toggle-button">Registrati ora</button></>
                  ) : !userType ? (
                    <>Hai già un account? <button onClick={() => { setIsLogin(true); setUserType(null); setStep(1); setErrors({}); setApiError(""); }} className="toggle-button">Accedi</button></>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}