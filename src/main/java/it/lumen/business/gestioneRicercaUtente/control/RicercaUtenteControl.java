package it.lumen.business.gestioneRicercaUtente.control;


import it.lumen.business.gestioneRicercaUtente.service.GREGAdapterService;
import it.lumen.business.gestioneRicercaUtente.service.RicercaUtenteService;
import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.data.dto.UtenteDTO;
import it.lumen.data.entity.Indirizzo;
import it.lumen.data.entity.Utente;
import it.lumen.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
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

        return ResponseEntity.ok(listaUtentiDTO);
    }

    @PostMapping("/ricercaGeografica")
    public ResponseEntity<List<Utente>> searchMatchingVolunteers(@RequestParam String token, @RequestBody SearchRequest frontendRequest) {

        String emailUtente = jwtUtil.extractEmail(token);
        Utente utenteLoggato = autenticazioneService.getUtente(emailUtente);

        if (utenteLoggato == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Indirizzo indirizzo = utenteLoggato.getIndirizzo();
        if (indirizzo == null) {
            return ResponseEntity.badRequest().body(null);
        }


        GREGAdapterService.VolontarioMatchRequest gregRequest = new GREGAdapterService.VolontarioMatchRequest();

        gregRequest.setStrada(indirizzo.getStrada());
        gregRequest.setNCivico(indirizzo.getNCivico());
        gregRequest.setCitta(indirizzo.getCitta());
        gregRequest.setProvincia(indirizzo.getProvincia());
        gregRequest.setCap(indirizzo.getCap());

        gregRequest.setCategory(frontendRequest.getCategory());
        gregRequest.setSubcategory(frontendRequest.getSubcategory());

        try {
            GREGAdapterService.VolontarioMatchResponse responseFromGreg =
            GREGAdapterService.findMatchingVolunteers(gregRequest);

            if (responseFromGreg == null || responseFromGreg.getVolunteerEmails() == null) {
                return ResponseEntity.ok(new ArrayList<>());
            }

            List<String> emails = responseFromGreg.getVolunteerEmails();

            List<Utente> utentiTrovati = emails.stream()
                    .map(autenticazioneService::getUtente)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            for(Utente utente : utentiTrovati) {
                utente.setPassword(null);
                if(utente.getImmagine()!=null) {
                    utente.setImmagine(autenticazioneService.recuperaImmagine(utente.getImmagine()));
                }
                utente.getIndirizzo().setIdIndirizzo(null);
            }
            Utente volontario = autenticazioneService.getUtente("volontario@lumen.it");
            volontario.setPassword(null);
            volontario.setRuolo(null);
            if(volontario.getImmagine()!=null) {
                volontario.setImmagine(autenticazioneService.recuperaImmagine(volontario.getImmagine()));
            }
            volontario.getIndirizzo().setIdIndirizzo(null);


            return ResponseEntity.ok(utentiTrovati);

        } catch (Exception e) {
            System.err.println("Errore GREG: " + e.getMessage());
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE, "Errore nel servizio di ricerca", e);
        }
    }

    public static class SearchRequest {
        private String category;
        private String subcategory;

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public String getSubcategory() { return subcategory; }
        public void setSubcategory(String subcategory) { this.subcategory = subcategory; }
    }
}

