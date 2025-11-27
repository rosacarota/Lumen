import React from 'react';
import '../stylesheets/InfoProfilo.css';

const InfoProfilo = ({
    title = "UniCiock",
    subtitle = "ENTE",
    description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoProfilo;