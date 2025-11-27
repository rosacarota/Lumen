import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Target, Users, Heart, Search, Calendar, MessageCircle } from 'lucide-react';
import '../stylesheets/ChiSiamo.css';

const ChiSiamo = () => {
    return (
        <div className="page-wrapper">
            <Navbar />

            <section className="about-hero">
                <div className="about-container">
                    <h1 className="about-title">Connettiamo cuori, <span className="highlight">costruiamo comunità</span>.</h1>
                    <p className="about-subtitle">
                        La tecnologia al servizio della solidarietà: un ponte digitale tra chi offre aiuto e chi ne ha bisogno.
                    </p>
                </div>
            </section>

            <section className="about-content">
                <div className="about-container">

                    <div className="text-block">
                        <p>
                            <strong>Lumen</strong> è la risposta digitale alle sfide del volontariato moderno. Uno spazio dove l'innovazione tecnologica incontra la passione civile,
                            perché crediamo che fare del bene debba essere semplice, efficace e alla portata di tutti.
                        </p>
                        <p>
                            La piattaforma non è solo uno strumento, ma un acceleratore di solidarietà.
                            Permette agli <strong>Enti</strong> di moltiplicare il loro impatto, ai <strong>Volontari</strong> di trovare esattamente dove servono di più,
                            e ai <strong>Beneficiari</strong> di ricevere aiuto con dignità e rapidità.
                        </p>
                    </div>

                    <div className="roles-section">
                        <h2 className="section-title">Il Nostro Impegno</h2>
                        <div className="roles-grid">
                            <div className="role-card">
                                <div className="icon-wrapper"><Target size={32} /></div>
                                <h3>Per gli Enti</h3>
                                <p>
                                    Forniamo strumenti digitali avanzati per semplificare la gestione delle attività, coordinare i volontari e raggiungere chi ha bisogno con maggiore efficienza.
                                </p>
                            </div>
                            <div className="role-card">
                                <div className="icon-wrapper"><Users size={32} /></div>
                                <h3>Per i Volontari</h3>
                                <p>
                                    Ti aiutiamo a trovare le opportunità perfette per te. Che tu abbia un'ora o un giorno, le tue competenze e il tuo tempo sono preziosi. Scopri dove puoi fare la differenza, vicino a casa tua.
                                </p>
                            </div>
                            <div className="role-card">
                                <div className="icon-wrapper"><Heart size={32} /></div>
                                <h3>Per i Beneficiari</h3>
                                <p>
                                    Garantiamo un canale sicuro, discreto e dignitoso per chiedere aiuto. Nessuno deve sentirsi solo: con Lumen, la rete di supporto della tua comunità è a portata di click.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="features-list-section">
                        <h2 className="section-title">Cosa Puoi Fare con Lumen</h2>
                        <ul className="features-list">
                            <li>
                                <Search className="list-icon" size={20} />
                                <span><strong>Esplora:</strong> Trova facilmente associazioni ed enti attivi nel tuo territorio.</span>
                            </li>
                            <li>
                                <Calendar className="list-icon" size={20} />
                                <span><strong>Partecipa:</strong> Iscriviti a eventi, campagne di raccolta fondi e iniziative sociali organizzate dagli enti.</span>
                            </li>
                            <li>
                                <Users className="list-icon" size={20} />
                                <span><strong>Collabora:</strong> Unisciti a una squadra di volontari e metti a frutto le tue passioni.</span>
                            </li>
                            <li>
                                <Heart className="list-icon" size={20} />
                                <span><strong>Chiedi Aiuto:</strong> Invia segnalazioni o richieste di supporto direttamente a chi può intervenire.</span>
                            </li>

                        </ul>
                    </div>

                    <div className="conclusion-block">
                        <p>
                            Insieme possiamo illuminare il futuro delle nostre comunità. <br />
                            Unisciti a Lumen e diventa parte del cambiamento.
                        </p>
                    </div>

                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ChiSiamo;
