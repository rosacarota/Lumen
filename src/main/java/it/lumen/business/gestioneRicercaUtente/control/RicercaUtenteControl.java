package it.lumen.business.gestioneRicercaUtente.control;


import it.lumen.business.gestioneRicercaUtente.service.GREGAdapterService;
import it.lumen.business.gestioneRicercaUtente.service.RicercaUtenteService;
import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.data.dto.UtenteDTO;
import it.lumen.data.entity.Utente;
import it.lumen.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/ricercaUtente")
public class RicercaUtenteControl {


    private final RicercaUtenteService ricercaUtenteService;
    private final GREGAdapterService GREGAdapterService;
    private final AutenticazioneService autenticazioneService;
    private final JwtUtil jwtUtil;

    @Autowired
    public RicercaUtenteControl(RicercaUtenteService ricercaUtenteService, GREGAdapterService GREGAdapterService, JwtUtil jwtUtil, AutenticazioneService autenticazioneService) {
        this.ricercaUtenteService = ricercaUtenteService;
        this.GREGAdapterService=GREGAdapterService;
        this.autenticazioneService = autenticazioneService;
        this.jwtUtil=jwtUtil;
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

    @PostMapping("/search")
    public ResponseEntity<?> searchMatchingVolunteers(
            @RequestBody GREGAdapterService.VolontarioMatchRequest request) {

        // 1. Validazione base dei dati di input (es. il CAP non è nullo)
        if (request.getCap() == null || request.getCap().isEmpty()) {
            // Potresti lanciare un'eccezione custom o restituire un BAD_REQUEST
            return ResponseEntity.badRequest().build();
        }

        // 2. Chiama l'Adapter per delegare la richiesta al servizio Python
        GREGAdapterService.VolontarioMatchResponse response = GREGAdapterService.findMatchingVolunteers(request);

        // 3. Restituisce il risultato con stato HTTP 200 OK
        return ResponseEntity.ok(response);

        // aggiungere conversione json in utenti
    }
}
