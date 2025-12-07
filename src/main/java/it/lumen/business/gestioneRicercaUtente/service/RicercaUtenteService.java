package it.lumen.business.gestioneRicercaUtente.service;

import it.lumen.data.dto.UtenteDTO;
import it.lumen.data.entity.Utente;

import java.util.List;

public interface RicercaUtenteService {

    List<UtenteDTO> getUtentiPerNome(String nome);
    UtenteDTO getUtenteByEmail(String email);

}
