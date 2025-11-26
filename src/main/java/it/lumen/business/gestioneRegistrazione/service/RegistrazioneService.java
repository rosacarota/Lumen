package it.lumen.business.gestioneRegistrazione.service;

import it.lumen.data.entity.Utente;
import jakarta.transaction.Transactional;

import java.io.IOException;

public interface RegistrazioneService {


    @Transactional
    void registraUtente(Utente utente);

    public boolean checkEmail(String email);

     String salvaImmagine(String base64String) throws IOException;

}
