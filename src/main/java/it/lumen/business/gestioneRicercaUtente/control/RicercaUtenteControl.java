package it.lumen.business.gestioneRicercaUtente.control;


import it.lumen.business.gestioneRicercaUtente.service.RicercaUtenteService;
import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.data.dto.UtenteDTO;
import it.lumen.data.entity.Utente;
import it.lumen.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/ricercaUtente")
public class RicercaUtenteControl {


    private final RicercaUtenteService ricercaUtenteService;
    private final JwtUtil jwtUtil;
    private final AutenticazioneService autenticazioneService;

    @Autowired
    public RicercaUtenteControl(RicercaUtenteService ricercaUtenteService, JwtUtil jwtUtil, AutenticazioneService autenticazioneService) {
        this.ricercaUtenteService = ricercaUtenteService;
        this.jwtUtil = jwtUtil;
        this.autenticazioneService = autenticazioneService;
    }

    @GetMapping("/cerca")
    public ResponseEntity<?> ricercaUtente(@RequestParam String nome) {

        if(nome ==  null || nome.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        List<Utente> listaUtenti = ricercaUtenteService.getUtentiPerNome(nome);

        List<UtenteDTO> listaUtentiDTO = listaUtenti.stream()
                .map(utente -> {
                    UtenteDTO utenteDTO = new UtenteDTO();
                    utenteDTO.setNome(utente.getNome());
                    utenteDTO.setCognome(utente.getCognome());
                    utenteDTO.setEmail(utente.getEmail());
                    utenteDTO.setRuolo(utente.getRuolo());
                    try{
                            utenteDTO.setImmagine(autenticazioneService.recuperaImmagine(utente.getImmagine()));
                            }catch(IOException e){
                        throw new RuntimeException(e);
                    }
                    return utenteDTO;
                }).collect(Collectors.toList());

        return ResponseEntity.ok(listaUtentiDTO);
    }
}
