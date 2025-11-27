package it.lumen.business.gestionePartecipazione.control;

import it.lumen.business.gestionePartecipazione.service.PartecipazioneEventoService;
import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.data.entity.Evento;
import it.lumen.data.entity.Partecipazione;
import it.lumen.data.entity.Utente;
import it.lumen.security.JwtUtil;

import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/partecipazione")
public class PartecipazioneEventoControl {

    @Autowired
    private PartecipazioneEventoService partecipazioneEventoService;

    @Autowired
    private AutenticazioneService autenticazioneService;

    @Autowired
    private JwtUtil util;

    @PostMapping("/aggiungi")
    public ResponseEntity<String> aggiungiPartecipazione(@RequestBody Partecipazione partecipazione, @RequestParam String token) {

        String ruolo = util.extractRuolo(token);
        String email = util.extractEmail(token);

        Evento evento = partecipazioneEventoService.getEventoById(partecipazione.getEvento().getIdEvento());
        Utente volontario = autenticazioneService.getUtente(email);

        try {
            if (evento == null) {
                return new ResponseEntity<>("Evento non trovato", HttpStatus.BAD_REQUEST);
            }
            if (volontario == null) {
                return new ResponseEntity<>("Utente non trovato", HttpStatus.BAD_REQUEST);
            }
            if (!"Volontario".equalsIgnoreCase(ruolo)) {
                return new ResponseEntity<>("Utente deve essere volontario per partecipare", HttpStatus.BAD_REQUEST);
            }

            partecipazione.setEvento(evento);
            partecipazione.setVolontario(volontario);

            List<Partecipazione> listaPartecipazioniEvento = partecipazioneEventoService.listaPartecipazioni(evento.getIdEvento());

            boolean giaPresente = listaPartecipazioniEvento.stream()
                    .anyMatch(p -> p.getVolontario().getEmail().equals(email));

            if (giaPresente) {
                return new ResponseEntity<>("Volontario partecipa già all'evento", HttpStatus.BAD_REQUEST);
            }

            if (listaPartecipazioniEvento.size() >= evento.getMaxPartecipanti()) {
                return new ResponseEntity<>("Numero di partecipanti al completo", HttpStatus.BAD_REQUEST);
            }

            partecipazione.setData(new Date(System.currentTimeMillis()));
            partecipazioneEventoService.aggiungiPartecipazione(partecipazione);
            return new ResponseEntity<>("Aggiunta partecipazione avvenuta con successo", HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>("Errore interno del server: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/modifica")
    public ResponseEntity<String> modificaPartecipazione(@RequestBody Partecipazione nuovaPartecipazione, @RequestParam String token) {

        String ruolo = util.extractRuolo(token);
        String email = util.extractEmail(token);

        Utente volontarioRichiedente = autenticazioneService.getUtente(email);

        try {
            if (volontarioRichiedente == null) {
                return new ResponseEntity<>("Utente non trovato", HttpStatus.BAD_REQUEST);
            }
            if (!"Volontario".equalsIgnoreCase(ruolo)) {
                return new ResponseEntity<>("Utente deve essere volontario per modificare la partecipazione", HttpStatus.BAD_REQUEST);
            }

            Partecipazione partecipazioneEsistente = partecipazioneEventoService.getPartecipazioneById(nuovaPartecipazione.getIdPartecipazione());

            if (partecipazioneEsistente == null) {
                return new ResponseEntity<>("Partecipazione non trovata", HttpStatus.NOT_FOUND);
            }

            if (!partecipazioneEsistente.getVolontario().getEmail().equals(email)) {
                return new ResponseEntity<>("Non hai i permessi per modificare questa partecipazione", HttpStatus.FORBIDDEN);
            }

            partecipazioneEsistente.setData(new Date(System.currentTimeMillis()));

            partecipazioneEventoService.modificaPartecipazione(partecipazioneEsistente);
            return new ResponseEntity<>("Modifica avvenuta con successo", HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Errore interno del server: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/rimuovi")
    public ResponseEntity<String> eliminaPartecipazione(@RequestBody Partecipazione partecipazioneInput, @RequestParam String token) {

        String ruolo = util.extractRuolo(token);
        String email = util.extractEmail(token);

        Utente volontarioRichiedente = autenticazioneService.getUtente(email);

        try {
            if (volontarioRichiedente == null) {
                return new ResponseEntity<>("Utente non trovato", HttpStatus.BAD_REQUEST);
            }
            if (!"Volontario".equalsIgnoreCase(ruolo)) {
                return new ResponseEntity<>("Utente deve essere volontario per eliminare la partecipazione", HttpStatus.BAD_REQUEST);
            }

            Partecipazione partecipazioneDaEliminare = partecipazioneEventoService.getPartecipazioneById(partecipazioneInput.getIdPartecipazione());

            if (partecipazioneDaEliminare == null) {
                return new ResponseEntity<>("Partecipazione non trovata", HttpStatus.NOT_FOUND);
            }

            if (!partecipazioneDaEliminare.getVolontario().getEmail().equals(email)) {
                return new ResponseEntity<>("Non hai i permessi per eliminare questa partecipazione", HttpStatus.FORBIDDEN);
            }

            partecipazioneEventoService.eliminaPartecipazione(partecipazioneDaEliminare.getIdPartecipazione());
            return new ResponseEntity<>("Eliminazione partecipazione avvenuta con successo", HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Errore interno del server: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/visualizzaPartecipazioniEvento")
    public ResponseEntity<?> visualizzaPartecipazioniEvento(@RequestBody Evento eventoInput, @RequestParam String token) {

        String email = util.extractEmail(token);

        if (email == null) {
            return new ResponseEntity<>("Token non valido", HttpStatus.UNAUTHORIZED);
        }

        try {
            Evento evento = partecipazioneEventoService.getEventoById(eventoInput.getIdEvento());

            if (evento == null) {
                return new ResponseEntity<>("Evento non trovato", HttpStatus.BAD_REQUEST);
            }

            List<Partecipazione> lista = partecipazioneEventoService.listaPartecipazioni(evento.getIdEvento());
            return ResponseEntity.ok(lista);

        } catch (Exception e) {
            return new ResponseEntity<>("Errore interno del server: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
