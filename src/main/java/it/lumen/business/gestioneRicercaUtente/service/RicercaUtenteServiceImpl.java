package it.lumen.business.gestioneRicercaUtente.service;
//import it.lumen.business.gestioneRicercaUtente.service.RicercaUtenteService;
import it.lumen.data.dto.UtenteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import it.lumen.data.dao.UtenteDAO;
import it.lumen.data.entity.Utente;

import java.util.List;

@Service
public class RicercaUtenteServiceImpl implements RicercaUtenteService {

    private final UtenteDAO utenteDAO;

    @Autowired
    public RicercaUtenteServiceImpl(UtenteDAO utenteDAO) {this.utenteDAO = utenteDAO;}

    @Override
    public List<Utente> getUtentiPerNome(String nome) {
        List <Utente> listaUtenti;

        if(nome == null){return null;}
        listaUtenti = utenteDAO.findUtentiByNome(nome);
        return listaUtenti;
    }

    @Override
    public UtenteDTO getUtenteByEmail(String email){

        if (email == null){return null;}
        Utente utente = utenteDAO.findByEmail(email);
        if (utente == null){return null;}

        UtenteDTO dto = new UtenteDTO();
        dto.setNome(utente.getNome());
        dto.setCognome(utente.getCognome());
        dto.setEmail(utente.getEmail());
        dto.setRuolo(utente.getRuolo());
        dto.setAmbito(utente.getAmbito());
        dto.setDescrizione(utente.getDescrizione());
        dto.setObjIndirizzo(utente.getIndirizzo());
        return dto;
    }
}
