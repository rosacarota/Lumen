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

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/affiliazione")
public class AffiliazioneControl {

    private final AffiliazioneService affiliazioneService;
    private final JwtUtil jwtUtil;
    private final AutenticazioneService autenticazioneService;

    @Autowired
    public AffiliazioneControl(AffiliazioneService affiliazioneService, JwtUtil jwtUtil, AutenticazioneService autenticazioneService) {
        this.affiliazioneService = affiliazioneService;
        this.jwtUtil = jwtUtil;
        this.autenticazioneService = autenticazioneService;
    }

    @PostMapping("/richiedi")
    public ResponseEntity<String> richiediAffiliazione(@RequestBody Affiliazione affiliazione, @RequestParam String token) {
        String email = jwtUtil.extractEmail(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token non valido");
        }

        Utente richiedente = autenticazioneService.getUtente(email);
        if (richiedente == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utente non trovato");
        }

        // Solo i volontari possono fare richiesta
        if (richiedente.getRuolo() != Utente.Ruolo.Volontario) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo i volontari possono richiedere l'affiliazione");
        }

        // Imposta il volontario richiedente automaticamente
        affiliazione.setVolontario(richiedente);

        // Verifica che l'ente target sia presente nel JSON
        if (affiliazione.getEnte() == null || affiliazione.getEnte().getEmail() == null) {
            return ResponseEntity.badRequest().body("Ente destinatario mancante");
        }

        // Imposta i valori di default
        affiliazione.setStato(Affiliazione.StatoAffiliazione.InAttesa);
        affiliazione.setDataInizio(Date.valueOf(LocalDate.now()));

        try {
            affiliazioneService.richiediAffiliazione(affiliazione);
            return ResponseEntity.ok("Richiesta di affiliazione inviata con successo");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore durante la creazione: " + e.getMessage());
        }
    }


    // ACCETTA RICHIESTA (Cambia stato a Accettata)
    @PostMapping("/accetta")
    public ResponseEntity<String> accettaAffiliazione(@RequestParam Integer idAffiliazione, @RequestParam String token) {
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

            // Verifica permessi: solo il destinatario della richiesta può accettare
            // Se l'iniziatore non è tracciato esplicitamente, controlliamo che chi accetta sia coinvolto
            boolean isCoinvolto = utenteLoggato.getEmail().equals(affiliazione.getEnte().getEmail()) ||
                    utenteLoggato.getEmail().equals(affiliazione.getVolontario().getEmail());

            if (!isCoinvolto) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Non hai i permessi per accettare questa richiesta");
            }

            affiliazioneService.accettaAffiliazione(idAffiliazione);
            return ResponseEntity.ok("Affiliazione accettata con successo");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore nell'accettazione: " + e.getMessage());
        }
    }

    @PostMapping("/rifiuta")
    public ResponseEntity<String> rifiutaAffiliazione(@RequestParam Integer idAffiliazione, @RequestParam String token) {
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

            // Controllo permessi: deve essere uno dei due attori coinvolti
            boolean isCoinvolto = utenteLoggato.getEmail().equals(affiliazione.getEnte().getEmail()) ||
                    utenteLoggato.getEmail().equals(affiliazione.getVolontario().getEmail());

            if (!isCoinvolto) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Non hai i permessi per gestire questa richiesta");
            }

            affiliazioneService.rifiutaAffiliazione(idAffiliazione);
            return ResponseEntity.ok("Richiesta rifiutata ed eliminata con successo");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore nel rifiuto: " + e.getMessage());
        }
    }

    @GetMapping("/listaAffiliati")
    public ResponseEntity<?> getListaAffiliati(@RequestParam String token) {
        String email = jwtUtil.extractEmail(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token non valido");
        }

        Utente ente = autenticazioneService.getUtente(email);

        if (ente == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utente non trovato");
        }

        if (ente.getRuolo() != Utente.Ruolo.Ente) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo gli Enti possono visualizzare i propri affiliati");
        }

        try {
            List<Utente> listaUtenti = affiliazioneService.getAffiliazioni(email);

            List<UtenteDTO> listaDTO = listaUtenti.stream()
                    .map(utente -> {
                        UtenteDTO dto = new UtenteDTO();
                        dto.setNome(utente.getNome());
                        dto.setCognome(utente.getCognome());
                        dto.setAmbito(utente.getAmbito());
                        dto.setImmagine(utente.getImmagine());
                        return dto;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(listaDTO);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore nel recupero affiliati: " + e.getMessage());
        }
    }


}
