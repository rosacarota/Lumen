package it.lumen.business.gestioneRichiesta.control;

import it.lumen.business.gestioneRichiesta.service.AffiliazioneService;
import it.lumen.data.dto.UtenteDTO;
import it.lumen.data.entity.Affiliazione;
import it.lumen.data.entity.Utente;
import it.lumen.security.JwtUtil;
import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controller REST per la gestione delle richieste di affiliazione.
 * Espone endpoint per inviare richieste, accettarle, rifiutarle e visualizzare
 * lo stato delle affiliazioni.
 */
@RestController
@RequestMapping("/affiliazione")
public class AffiliazioneControl {

    private final AffiliazioneService affiliazioneService;
    private final JwtUtil jwtUtil;
    private final AutenticazioneService autenticazioneService;

    /**
     * Costruttore per l'iniezione delle dipendenze.
     *
     * @param affiliazioneService   Servizio per la gestione delle affiliazioni.
     * @param jwtUtil               Utility per la gestione dei token JWT.
     * @param autenticazioneService Servizio per l'autenticazione e il recupero dati
     *                              utente.
     */
    @Autowired
    public AffiliazioneControl(AffiliazioneService affiliazioneService, JwtUtil jwtUtil,
            AutenticazioneService autenticazioneService) {
        this.affiliazioneService = affiliazioneService;
        this.jwtUtil = jwtUtil;
        this.autenticazioneService = autenticazioneService;
    }

    /**
     * Controlla se esiste una richiesta di affiliazione per il volontario
     * autenticato.
     *
     * @param token Il token JWT dell'utente.
     * @return true se l'affiliazione esiste, false altrimenti.
     */
    @GetMapping("/check")
    public ResponseEntity<Boolean> checkAffiliazione(@RequestParam String token) {

        String emailVolontario = jwtUtil.extractEmail(token);

        if (emailVolontario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        }

        return ResponseEntity.status(HttpStatus.OK).body(affiliazioneService.checkAffiliazione(emailVolontario));
    }

    /**
     * Invia una nuova richiesta di affiliazione da parte di un volontario verso un
     * ente.
     *
     * @param affiliazione Oggetto contenente i dettagli della richiesta (es. ente e
     *                     descrizione).
     * @param token        Il token JWT del volontario richiedente.
     * @return Un messaggio di conferma o errore.
     */
    @PostMapping("/richiedi")
    public ResponseEntity<String> richiediAffiliazione(@RequestBody Affiliazione affiliazione,
            @RequestParam String token) {
        String email = jwtUtil.extractEmail(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token non valido");
        }

        Utente richiedente = autenticazioneService.getUtente(email);
        if (richiedente == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utente non trovato");
        }

        if (richiedente.getRuolo() != Utente.Ruolo.Volontario) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Solo i volontari possono richiedere l'affiliazione");
        }

        affiliazione.setVolontario(richiedente);

        if (affiliazione.getEnte() == null || affiliazione.getEnte().getEmail() == null) {
            return ResponseEntity.badRequest().body("Ente destinatario mancante");
        }

        affiliazione.setStato(Affiliazione.StatoAffiliazione.InAttesa);
        affiliazione.setDataInizio(Date.valueOf(LocalDate.now()));

        String emailEnte = affiliazione.getEnte().getEmail();
        Utente ente = autenticazioneService.getUtente(emailEnte);

        if (ente.getRuolo() != Utente.Ruolo.Ente) {
            return ResponseEntity.badRequest().body("Puoi fare la richiesta solo ad un ente");
        }

        affiliazione.setEnte(ente);

        if (affiliazioneService.checkAffiliazione(email)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("la richiesta è già presente");
        }

        try {
            affiliazioneService.richiediAffiliazione(affiliazione);
            return ResponseEntity.ok("Richiesta di affiliazione inviata con successo");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Errore durante la creazione: " + e.getMessage());
        }
    }

    /**
     * Accetta una richiesta di affiliazione pendente.
     * Può essere invocata dall'ente destinatario o dal volontario coinvolto (anche
     * se logicamente è l'ente che accetta).
     *
     * @param idAffiliazione ID della richiesta da accettare.
     * @param token          Il token JWT dell'utente che esegue l'operazione.
     * @return Messaggio di esito.
     */
    @GetMapping("/accetta")
    public ResponseEntity<String> accettaAffiliazione(@RequestParam Integer idAffiliazione,
            @RequestParam String token) {
        String email = jwtUtil.extractEmail(token);
        Utente utenteLoggato = autenticazioneService.getUtente(email);

        if (utenteLoggato == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utente non autenticato");
        }

        try {
            Affiliazione affiliazione = affiliazioneService.getAffiliazione(idAffiliazione);
            if (affiliazione == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Affiliazione non trovata");
            }

            boolean isCoinvolto = utenteLoggato.getEmail().equals(affiliazione.getEnte().getEmail()) ||
                    utenteLoggato.getEmail().equals(affiliazione.getVolontario().getEmail());

            if (!isCoinvolto) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Non hai i permessi per accettare questa richiesta");
            }

            affiliazioneService.accettaAffiliazione(idAffiliazione);
            return ResponseEntity.ok("Affiliazione accettata con successo");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Errore nell'accettazione: " + e.getMessage());
        }
    }

    /**
     * Rifiuta una richiesta di affiliazione pendente.
     *
     * @param idAffiliazione ID della richiesta da rifiutare (ed eliminare).
     * @param token          Il token JWT dell'utente che esegue l'operazione.
     * @return Messaggio di esito.
     */
    @GetMapping("/rifiuta")
    public ResponseEntity<String> rifiutaAffiliazione(@RequestParam Integer idAffiliazione,
            @RequestParam String token) {
        String email = jwtUtil.extractEmail(token);
        Utente utenteLoggato = autenticazioneService.getUtente(email);

        if (utenteLoggato == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utente non autenticato");
        }

        try {
            Affiliazione affiliazione = affiliazioneService.getAffiliazione(idAffiliazione);
            if (affiliazione == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Affiliazione non trovata");
            }

            boolean isCoinvolto = utenteLoggato.getEmail().equals(affiliazione.getEnte().getEmail()) ||
                    utenteLoggato.getEmail().equals(affiliazione.getVolontario().getEmail());

            if (!isCoinvolto) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Non hai i permessi per gestire questa richiesta");
            }

            affiliazioneService.rifiutaAffiliazione(idAffiliazione);
            return ResponseEntity.ok("Richiesta rifiutata ed eliminata con successo");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Errore nel rifiuto: " + e.getMessage());
        }
    }

    /**
     * Restituisce la lista dei volontari affiliati (accettati) per l'ente
     * autenticato.
     *
     * @param token Il token JWT dell'ente.
     * @return Una lista di oggetti {@link UtenteDTO} rappresentanti i volontari
     *         affiliati.
     */
    @GetMapping("/listaAffiliati")
    public ResponseEntity<?> getListaAffiliati(@RequestParam String token) {
        String email = jwtUtil.extractEmail(token);
        if (email == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token non valido");

        Utente ente = autenticazioneService.getUtente(email);
        if (ente == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utente non trovato");

        if (ente.getRuolo() != Utente.Ruolo.Ente) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Solo gli Enti possono visualizzare i propri affiliati");
        }

        try {
            List<Affiliazione> affiliazioni = affiliazioneService.getAffiliazioni(ente);

            List<UtenteDTO> listaDTO = affiliazioni.stream()
                    .map(aff -> {
                        Utente utente = aff.getVolontario();

                        UtenteDTO dto = new UtenteDTO();
                        dto.setIdAffiliazione(aff.getIdAffiliazione());
                        dto.setNome(utente.getNome());
                        dto.setCognome(utente.getCognome());
                        dto.setAmbito(utente.getAmbito());
                        try {
                            dto.setImmagine(autenticazioneService.recuperaImmagine(utente.getImmagine()));
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                        return dto;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(listaDTO);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore: " + e.getMessage());
        }
    }

    /**
     * Restituisce la lista delle richieste di affiliazione in attesa per l'ente
     * autenticato.
     *
     * @param token Il token JWT dell'ente.
     * @return Una lista di mappe contenenti i dettagli della richiesta e del
     *         volontario richiedente.
     */
    @GetMapping("/richiesteInAttesa")
    public ResponseEntity<?> getRichiesteInAttesa(@RequestParam String token) {
        String email = jwtUtil.extractEmail(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token non valido");
        }

        Utente ente = autenticazioneService.getUtente(email);
        if (ente == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utente non trovato");
        }

        if (ente.getRuolo() != Utente.Ruolo.Ente) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo gli Enti possono visualizzare le richieste");
        }

        try {
            List<Affiliazione> listaRichieste = affiliazioneService.getRichiesteInAttesa(ente);

            List<Map<String, Object>> rispostaCompleta = new ArrayList<>();

            for (Affiliazione aff : listaRichieste) {
                Map<String, Object> elemento = new HashMap<>();

                Map<String, Object> datiRichiesta = new HashMap<>();
                datiRichiesta.put("idAffiliazione", aff.getIdAffiliazione());
                datiRichiesta.put("descrizione", aff.getDescrizione());
                datiRichiesta.put("dataInizio", aff.getDataInizio());
                datiRichiesta.put("stato", aff.getStato());

                elemento.put("richiesta", datiRichiesta);

                Utente v = aff.getVolontario();
                UtenteDTO volontarioDTO = new UtenteDTO();
                volontarioDTO.setNome(v.getNome());
                volontarioDTO.setCognome(v.getCognome());
                volontarioDTO.setAmbito(v.getAmbito());
                volontarioDTO.setImmagine(v.getImmagine());

                elemento.put("volontario", volontarioDTO);

                // Aggiungi alla lista finale
                rispostaCompleta.add(elemento);
            }

            return ResponseEntity.ok(rispostaCompleta);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Errore nel recupero richieste: " + e.getMessage());
        }
    }

}
