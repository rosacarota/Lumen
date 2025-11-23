package it.lumen.business.gestioneAutenticazione.service;

import it.lumen.data.entity.Utente;

public interface AutenticazioneService {

    Utente login(String email, String password);

    public boolean checkEmail(String email);
}
