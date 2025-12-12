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
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/ricercaUtente")
/**
 * Controller REST che gestisce le operazioni di ricerca degli utenti.
 * Fornisce endpoint per cercare utenti per nome, ottenere dettagli tramite
 * email
 * e ricercare volontari basandosi sulla posizione geografica tramite il
 * servizio GREG.
 */
public class RicercaUtenteControl {

    private final RicercaUtenteService ricercaUtenteService;
    private final GREGAdapterService GREGAdapterService;
    private final AutenticazioneService autenticazioneService;
    private final JwtUtil jwtUtil;

    @Autowired
    /**
     * Costruttore per l'iniezione delle dipendenze.
     *
     * @param ricercaUtenteService  Servizio per la gestione della ricerca utente
     * @param GREGAdapterService    Servizio adapter per la comunicazione con il
     *                              sistema GREG
     * @param jwtUtil               Utility per la gestione dei token JWT
     * @param autenticazioneService Servizio per le operazioni di autenticazione e
     *                              recupero dati utente
     */
    public RicercaUtenteControl(RicercaUtenteService ricercaUtenteService, GREGAdapterService GREGAdapterService,
            JwtUtil jwtUtil, AutenticazioneService autenticazioneService) {
        this.ricercaUtenteService = ricercaUtenteService;
        this.GREGAdapterService = GREGAdapterService;
        this.autenticazioneService = autenticazioneService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/cerca")
    /**
     * Cerca una lista di utenti che corrispondono al nome fornito.
     *
     * @param nome Il nome (o parte del nome) dell'utente da cercare.
     * @return Una ResponseEntity contenente una lista di UtenteDTO se trovati,
     *         o NO_CONTENT se il parametro è vuoto o nullo.
     */
    public ResponseEntity<?> ricercaUtente(@RequestParam String nome) {

        if (nome == null || nome.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        if (nome.length() > 100) {
            return ResponseEntity.badRequest().body(Map.of("message", "Il nome è troppo lungo"));
        }

        List<UtenteDTO> listaUtentiDTO = ricercaUtenteService.getUtentiPerNome(nome);
        return ResponseEntity.ok(listaUtentiDTO);
    }

    @PostMapping("/datiUtente")
    /**
     * Recupera i dettagli di un utente specifico tramite la sua email.
     *
     * @param paramEmail Una mappa contenente l'email dell'utente da cercare (chiave
     *                   "email").
     * @return Una ResponseEntity contenente l'UtenteDTO corrispondente,
     *         o una risposta badRequest se l'email non è fornita.
     */
    public ResponseEntity<UtenteDTO> datiUtente(@RequestBody Map<String, String> paramEmail) {

        String email = paramEmail.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        UtenteDTO utenteDTO = ricercaUtenteService.getUtenteByEmail(email);
        return ResponseEntity.ok(utenteDTO);
    }

    @PostMapping("/ricercaGeografica")
    /**
     * Ricerca volontari compatibili in base alla posizione geografica dell'utente
     * richiedente
     * e alla categoria/sottocategoria del servizio richiesto.
     * Utilizza il servizio esterno GREG per il matching geografico.
     *
     * @param token           Il token JWT dell'utente loggato.
     * @param frontendRequest Oggetto contenente i criteri di ricerca (categoria e
     *                        sottocategoria).
     * @return Una ResponseEntity contenente una lista di utenti volontari trovati,
     *         oppure vari stati di errore (UNAUTHORIZED, BAD_REQUEST,
     *         SERVICE_UNAVAILABLE) in caso di problemi.
     */
    public ResponseEntity<List<?>> searchMatchingVolunteers(@RequestParam String token,
            @RequestBody SearchRequest frontendRequest) {

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
            GREGAdapterService.VolontarioMatchResponse responseFromGreg = GREGAdapterService
                    .findMatchingVolunteers(gregRequest);

            if (responseFromGreg == null || responseFromGreg.getVolunteerEmails() == null) {
                return ResponseEntity.ok(new ArrayList<>());
            }

            List<String> emails = responseFromGreg.getVolunteerEmails();

            List<Utente> utentiTrovati = emails.stream()
                    .map(autenticazioneService::getUtente)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            for (Utente utente : utentiTrovati) {
                utente.setPassword(null);
                if (utente.getImmagine() != null) {
                    utente.setImmagine(autenticazioneService.recuperaImmagine(utente.getImmagine()));
                }
                utente.getIndirizzo().setIdIndirizzo(null);
            }
            Utente volontario = autenticazioneService.getUtente("volontario@lumen.it");
            volontario.setPassword(null);
            volontario.setRuolo(null);
            if (volontario.getImmagine() != null) {
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

    /**
     * Classe DTO interna per rappresentare la richiesta di ricerca volontari
     * proveniente dal frontend.
     */
    public static class SearchRequest {
        private String category;
        private String subcategory;

        /**
         * Restituisce l'ambito in cui opera il volontario o l'ente.
         * 
         * @return L'ambito.
         */
        public String getCategory() {
            return category;
        }

        /**
         * Imposta l'ambito in cui opera il volontario o l'ente.
         * 
         * @param category L'ambito da impostare.
         */
        public void setCategory(String category) {
            this.category = category;
        }

        /**
         * Restituisce il sottogruppo di competenze del volontario o l'ente.
         * 
         * @return Il sottogruppo di competenze.
         */
        public String getSubcategory() {
            return subcategory;
        }

        /**
         * Imposta il sottogruppo di competenze del volontario o l'ente.
         * 
         * @param subcategory Il sottogruppo di competenze da impostare.
         */
        public void setSubcategory(String subcategory) {
            this.subcategory = subcategory;
        }
    }
}
