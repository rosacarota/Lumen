import React from 'react';
import '../stylesheets/InfoProfilo.css';

const InfoProfilo = ({
    title = "UniCiock",
    subtitle = "ENTE",
    description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    stat1 = "4000 Followers",
    stat2 = "20 Eventi",
    isFollowing,
    onToggle
}) => {
    return (
        <div className="hero-wrapper">
            <div className="hero-cover"></div>
            <div className="hero-info-bar">
                <div className="hero-content-inner">
                    <div className="avatar-container">
                        <span style={{color:'#ccc'}}>LOGO</span>
                    </div>
                    <div className="ente-text">
                        <h1>{title}</h1>
                        <h3>{subtitle}</h3>
                        <p>{description}</p>
                        <div className="stats-row">
                            <span className="pill">{stat1}</span>
                            <span className="pill">{stat2}</span>
                            <button
                                className={`follow-btn ${isFollowing ? 'following' : ''}`}
                                onClick={onToggle}
                            >
                                {isFollowing ? 'Seguito' : 'Segui'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoProfilo;