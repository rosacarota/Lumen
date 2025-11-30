package it.lumen.business.gestioneAutenticazione.service;

import it.lumen.data.entity.Utente;

import java.io.IOException;

public interface AutenticazioneService {

    Utente login(String email, String password);

    Utente getUtente(String email);

    public String recuperaImmagine(String pathImmagine) throws IOException;
}
