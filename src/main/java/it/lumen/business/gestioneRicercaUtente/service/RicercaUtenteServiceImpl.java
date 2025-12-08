package it.lumen.business.gestioneRicercaUtente.service;
//import it.lumen.business.gestioneRicercaUtente.service.RicercaUtenteService;
import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.business.gestioneAutenticazione.service.AutenticazioneServiceImpl;
import it.lumen.data.dto.UtenteDTO;
import jakarta.validation.constraints.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import it.lumen.data.dao.UtenteDAO;
import it.lumen.data.entity.Utente;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RicercaUtenteServiceImpl implements RicercaUtenteService {

    private final UtenteDAO utenteDAO;
    private final AutenticazioneService autenticazioneService;

    @Autowired
    public RicercaUtenteServiceImpl(UtenteDAO utenteDAO, AutenticazioneService autenticazioneService) {
        this.utenteDAO = utenteDAO;
        this.autenticazioneService = autenticazioneService;
    }

    @Override
    public List<UtenteDTO> getUtentiPerNome(String nome) {

        if(nome == null){return null;}
        List <Utente> listaUtenti;
        listaUtenti = utenteDAO.findUtentiByNome(nome);
        List<UtenteDTO> listaUtentiDTO = listaUtenti.stream()
                .map(utente -> {
                    UtenteDTO utenteDTO = new UtenteDTO();
                    utenteDTO.setNome(utente.getNome());
                    utenteDTO.setCognome(utente.getCognome());
                    utenteDTO.setEmail(utente.getEmail());
                    utenteDTO.setRuolo(utente.getRuolo());
                    utenteDTO.setAmbito(utente.getAmbito());
                    utenteDTO.setDescrizione(utente.getDescrizione());
                    utenteDTO.setObjIndirizzo(utente.getIndirizzo());
                    try{
                        utenteDTO.setImmagine(autenticazioneService.recuperaImmagine(utente.getImmagine()));
                    }catch(IOException e){
                        throw new RuntimeException(e);
                    }
                    return utenteDTO;
                }).collect(Collectors.toList());

        return listaUtentiDTO;
    }

    @Override
    public UtenteDTO getUtenteByEmail(@Email(message = "Email non valida") String email){

        if (email == null){return null;}
        Utente utente = utenteDAO.findByEmail(email);
        if (utente == null){return null;}

        UtenteDTO dto = new UtenteDTO();
        dto.setNome(utente.getNome());
        dto.setCognome(utente.getCognome());
        dto.setEmail(utente.getEmail());
        dto.setRecapitoTelefonico(utente.getRecapitoTelefonico());
        dto.setRuolo(utente.getRuolo());
        dto.setAmbito(utente.getAmbito());
        dto.setDescrizione(utente.getDescrizione());
        dto.setObjIndirizzo(utente.getIndirizzo());
        try {
            dto.setImmagine(autenticazioneService.recuperaImmagine(utente.getImmagine()));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return dto;
    }
}
