package it.lumen.business.gestioneRegistrazione.service;

import it.lumen.data.entity.Utente;
import jakarta.transaction.Transactional;

public interface RegistrazioneService {


    @Transactional
    void registraUtente(Utente utente);

    public boolean checkEmail(String email);

}
