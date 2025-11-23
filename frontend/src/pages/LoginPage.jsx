import { useState } from 'react';
import { User, Lock, Mail, Building2, Heart, Users } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = () => {
    console.log('Form submitted');
  };

  const getWelcomeMessage = () => {
    if (isLogin) {
      return {
        title: "Benvenuto.",
        subtitle: "Unisciti alla nostra community di volontari e fai la differenza nella tua comunità.",
        footer: "Non hai un account?"
      };
    }
    
    if (!userType) {
      return {
        title: "Il primo passo.",
        subtitle: "Scegli il tipo di profilo più adatto a te e inizia il tuo viaggio nel mondo del volontariato.",
        footer: "Hai già un account?"
      };
    }
    
    return {
      title: "Ci siamo quasi.",
      subtitle: "Completa la registrazione e diventa parte della nostra community. Insieme possiamo fare la differenza.",
      footer: "Hai già un account?"
    };
  };

  const renderRegistrationFields = () => {
    const commonFields = (
      <>
        <div style={styles.inputGroup}>
          <Mail style={styles.inputIcon} />
          <input
            type="email"
            placeholder="Email"
            style={styles.inputField}
          />
        </div>
        <div style={styles.inputGroup}>
          <Lock style={styles.inputIcon} />
          <input
            type="password"
            placeholder="Password"
            style={styles.inputField}
          />
        </div>
        <div style={styles.inputGroup}>
          <Lock style={styles.inputIcon} />
          <input
            type="password"
            placeholder="Conferma Password"
            style={styles.inputField}
          />
        </div>
      </>
    );

    switch (userType) {
      case 'ente':
        return (
          <div style={styles.fieldsContainer}>
            <div style={styles.inputGroup}>
              <Building2 style={styles.inputIcon} />
              <input type="text" placeholder="Nome Ente" style={styles.inputField} />
            </div>
            <div style={styles.inputGroup}>
              <User style={styles.inputIcon} />
              <input type="text" placeholder="Referente" style={styles.inputField} />
            </div>
            <div style={styles.inputGroup}>
              <input type="text" placeholder="Partita IVA / Codice Fiscale" style={styles.inputFieldNoIcon} />
            </div>
            {commonFields}
          </div>
        );
      case 'volontario':
        return (
          <div style={styles.fieldsContainer}>
            <div style={styles.inputGroup}>
              <User style={styles.inputIcon} />
              <input type="text" placeholder="Nome" style={styles.inputField} />
            </div>
            <div style={styles.inputGroup}>
              <User style={styles.inputIcon} />
              <input type="text" placeholder="Cognome" style={styles.inputField} />
            </div>
            <div style={styles.inputGroup}>
              <input type="date" style={styles.inputFieldNoIcon} />
            </div>
            {commonFields}
          </div>
        );
      case 'beneficiario':
        return (
          <div style={styles.fieldsContainer}>
            <div style={styles.inputGroup}>
              <User style={styles.inputIcon} />
              <input type="text" placeholder="Nome" style={styles.inputField} />
            </div>
            <div style={styles.inputGroup}>
              <User style={styles.inputIcon} />
              <input type="text" placeholder="Cognome" style={styles.inputField} />
            </div>
            <div style={styles.inputGroup}>
              <input type="tel" placeholder="Telefono" style={styles.inputFieldNoIcon} />
            </div>
            {commonFields}
          </div>
        );
      default:
        return null;
    }
  };

  const welcomeMsg = getWelcomeMessage();

  return (
    <div style={styles.loginPage}>
      <style>{keyframes}</style>
      <div style={styles.container}>
        {/* Left Panel - Conditional Order */}
        <div style={{
          ...styles.leftPanel,
          order: isLogin ? 1 : 2,
        }}>
          <div style={styles.gradientOverlay}></div>
          
          <div style={styles.blurCircle1}></div>
          <div style={styles.blurCircle2}></div>
          
          <div style={styles.welcomeContent} key={isLogin ? 'login' : userType || 'signup'}>
            <h1 style={styles.welcomeTitle}>{welcomeMsg.title}</h1>
            <p style={styles.welcomeSubtitle}>{welcomeMsg.subtitle}</p>
            <div style={styles.welcomeFooter}>
              {welcomeMsg.footer}{' '}
              <button
                onClick={() => {
                  if (isLogin) {
                    setIsLogin(false);
                    setUserType(null);
                  } else {
                    setIsLogin(true);
                    setUserType(null);
                  }
                }}
                style={styles.linkButton}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                {isLogin ? 'Iscriviti ora' : 'Accedi'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div style={{
          ...styles.rightPanel,
          order: isLogin ? 2 : 1,
        }}>
          <div style={styles.formContainer}>
            <div style={styles.logoSection}>
              <div style={styles.logoWrapper}>
                <Heart style={styles.logoIcon} />
                <span style={styles.logoText}>Volontariato</span>
              </div>
              <p style={styles.logoSubtitle}>Insieme per fare la differenza</p>
            </div>

            <div style={styles.formContent}>
              {!isLogin && !userType ? (
                <div style={styles.userTypeSelection}>
                  <h2 style={styles.formTitle}>Che tipo di utente sei?</h2>
                  
                  <button 
                    onClick={() => setUserType('ente')} 
                    style={styles.userTypeCard}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#4AAFB8';
                      e.currentTarget.style.background = '#E9FBE7';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.querySelector('.icon-wrapper').style.background = '#7CCE6B';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.querySelector('.icon-wrapper').style.background = '#E9FBE7';
                    }}
                  >
                    <div className="icon-wrapper" style={styles.userTypeIconWrapper}>
                      <Building2 style={styles.userTypeIcon} />
                    </div>
                    <div style={styles.userTypeInfo}>
                      <div style={styles.userTypeName}>Ente</div>
                      <div style={styles.userTypeDesc}>Organizzazione o associazione</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => setUserType('volontario')} 
                    style={styles.userTypeCard}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#4AAFB8';
                      e.currentTarget.style.background = '#E9FBE7';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.querySelector('.icon-wrapper').style.background = '#7CCE6B';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.querySelector('.icon-wrapper').style.background = '#E9FBE7';
                    }}
                  >
                    <div className="icon-wrapper" style={styles.userTypeIconWrapper}>
                      <Heart style={styles.userTypeIcon} />
                    </div>
                    <div style={styles.userTypeInfo}>
                      <div style={styles.userTypeName}>Volontario</div>
                      <div style={styles.userTypeDesc}>Voglio offrire il mio tempo</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => setUserType('beneficiario')} 
                    style={styles.userTypeCard}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#4AAFB8';
                      e.currentTarget.style.background = '#E9FBE7';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.querySelector('.icon-wrapper').style.background = '#7CCE6B';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.querySelector('.icon-wrapper').style.background = '#E9FBE7';
                    }}
                  >
                    <div className="icon-wrapper" style={styles.userTypeIconWrapper}>
                      <Users style={styles.userTypeIcon} />
                    </div>
                    <div style={styles.userTypeInfo}>
                      <div style={styles.userTypeName}>Beneficiario</div>
                      <div style={styles.userTypeDesc}>Ho bisogno di supporto</div>
                    </div>
                  </button>
                </div>
              ) : !isLogin && userType ? (
                <div style={styles.registrationForm}>
                  <button 
                    onClick={() => setUserType(null)} 
                    style={styles.backButton}
                    onMouseEnter={(e) => e.target.style.color = '#087886'}
                    onMouseLeave={(e) => e.target.style.color = '#6B7280'}
                  >
                    ← Indietro
                  </button>
                  <h2 style={styles.formTitle}>
                    Registrazione {userType === 'ente' ? 'Ente' : userType === 'volontario' ? 'Volontario' : 'Beneficiario'}
                  </h2>
                  {renderRegistrationFields()}
                  <button 
                    onClick={handleSubmit} 
                    style={styles.submitButton}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(8, 120, 134, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(8, 120, 134, 0.3)';
                    }}
                  >
                    REGISTRATI
                  </button>
                </div>
              ) : (
                <div style={styles.loginForm}>
                  <div style={styles.avatarWrapper}>
                    <User style={styles.avatarIcon} />
                  </div>

                  <div style={styles.fieldsContainer}>
                    <div style={styles.inputGroup}>
                      <User style={styles.inputIcon} />
                      <input 
                        type="text" 
                        placeholder="USERNAME" 
                        style={styles.inputField}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#4AAFB8';
                          e.target.style.boxShadow = '0 0 0 3px rgba(74, 175, 184, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#E5E7EB';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <Lock style={styles.inputIcon} />
                      <input 
                        type="password" 
                        placeholder="PASSWORD" 
                        style={styles.inputField}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#4AAFB8';
                          e.target.style.boxShadow = '0 0 0 3px rgba(74, 175, 184, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#E5E7EB';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleSubmit} 
                    style={styles.submitButton}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(8, 120, 134, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(8, 120, 134, 0.3)';
                    }}
                  >
                    LOGIN
                  </button>

                  <div style={styles.loginOptions}>
                    <label style={styles.rememberMe}>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={styles.checkbox}
                      />
                      Ricordami
                    </label>
                    <button 
                      style={styles.forgotPassword}
                      onMouseEnter={(e) => e.target.style.color = '#4AAFB8'}
                      onMouseLeave={(e) => e.target.style.color = '#6B7280'}
                    >
                      Password dimenticata?
                    </button>
                  </div>
                </div>
              )}

              <div style={styles.dotsIndicator}>
                <span style={styles.dotActive}></span>
                <span style={styles.dot}></span>
                <span style={styles.dot}></span>
              </div>

              <div style={styles.toggleForm}>
                {isLogin ? (
                  <>
                    Non hai un account?{' '}
                    <button
                      onClick={() => {
                        setIsLogin(false);
                        setUserType(null);
                      }}
                      style={styles.toggleButton}
                      onMouseEnter={(e) => e.target.style.color = '#4AAFB8'}
                      onMouseLeave={(e) => e.target.style.color = '#087886'}
                    >
                      Registrati ora
                    </button>
                  </>
                ) : (
                  <>
                    Hai già un account?{' '}
                    <button
                      onClick={() => {
                        setIsLogin(true);
                        setUserType(null);
                      }}
                      style={styles.toggleButton}
                      onMouseEnter={(e) => e.target.style.color = '#4AAFB8'}
                      onMouseLeave={(e) => e.target.style.color = '#087886'}
                    >
                      Accedi
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const keyframes = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;

const styles = {
  loginPage: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #F7FBFB 0%, #E9FBE7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  container: {
    width: '100%',
    maxWidth: '1200px',
    display: 'flex',
    borderRadius: '30px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(8, 120, 134, 0.15)',
    background: 'white',
    minHeight: '600px',
  },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #087886 0%, #4AAFB8 50%, #7CCE6B 100%)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  gradientOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(8, 120, 134, 0.8) 0%, rgba(74, 175, 184, 0.6) 50%, rgba(124, 206, 107, 0.4) 100%)',
  },
  blurCircle1: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    background: '#7CCE6B',
    borderRadius: '50%',
    filter: 'blur(80px)',
    opacity: 0.5,
    top: '10%',
    left: '10%',
    animation: 'pulse 4s ease-in-out infinite',
  },
  blurCircle2: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    background: '#4AAFB8',
    borderRadius: '50%',
    filter: 'blur(80px)',
    opacity: 0.5,
    bottom: '10%',
    right: '10%',
    animation: 'pulse 5s ease-in-out infinite',
  },
  welcomeContent: {
    position: 'relative',
    zIndex: 10,
    color: 'white',
    textAlign: 'center',
    animation: 'fadeInUp 0.6s ease-out',
  },
  welcomeTitle: {
    fontSize: '56px',
    fontWeight: 700,
    marginBottom: '24px',
    textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)',
  },
  welcomeSubtitle: {
    fontSize: '18px',
    lineHeight: 1.6,
    opacity: 0.95,
    marginBottom: '32px',
  },
  welcomeFooter: {
    fontSize: '14px',
    opacity: 0.9,
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '14px',
    transition: 'opacity 0.3s ease',
  },
  rightPanel: {
    flex: 1,
    background: 'white',
    padding: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  formContainer: {
    width: '100%',
    maxWidth: '420px',
  },
  logoSection: {
    marginBottom: '40px',
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    color: '#087886',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#087886',
  },
  logoSubtitle: {
    fontSize: '14px',
    color: '#6B7280',
  },
  formContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#087886',
    marginBottom: '24px',
  },
  avatarWrapper: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '4px solid #E5E7EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  avatarIcon: {
    width: '40px',
    height: '40px',
    color: '#9CA3AF',
  },
  fieldsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
    color: '#9CA3AF',
    pointerEvents: 'none',
  },
  inputField: {
    width: '100%',
    padding: '12px 16px 12px 44px',
    border: '2px solid #E5E7EB',
    borderRadius: '25px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  inputFieldNoIcon: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #E5E7EB',
    borderRadius: '25px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  submitButton: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #087886 0%, #4AAFB8 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(8, 120, 134, 0.3)',
    transition: 'all 0.3s ease',
  },
  loginOptions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
  },
  rememberMe: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#6B7280',
    cursor: 'pointer',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  forgotPassword: {
    background: 'none',
    border: 'none',
    color: '#6B7280',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'color 0.3s ease',
  },
  userTypeSelection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  userTypeCard: {
    width: '100%',
    padding: '16px',
    background: 'white',
    border: '2px solid #E5E7EB',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.3s ease',
  },
  userTypeIconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: '#E9FBE7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.3s ease',
  },
  userTypeIcon: {
    width: '24px',
    height: '24px',
    color: '#087886',
  },
  userTypeInfo: {
    flex: 1,
  },
  userTypeName: {
    fontWeight: 600,
    color: '#087886',
    marginBottom: '4px',
  },
  userTypeDesc: {
    fontSize: '14px',
    color: '#6B7280',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#6B7280',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '16px',
    transition: 'color 0.3s ease',
  },
  dotsIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '16px 0',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#E5E7EB',
    transition: 'background 0.3s ease',
  },
  dotActive: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#087886',
  },
  toggleForm: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#6B7280',
    paddingTop: '16px',
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: '#087886',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'color 0.3s ease',
  },
  registrationForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
};