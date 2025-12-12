package it.lumen.business.gestionePartecipazione.control;

import it.lumen.business.gestionePartecipazione.service.PartecipazioneEventoService;
import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.data.dto.PartecipazioneDTO;
import it.lumen.data.entity.Evento;
import it.lumen.data.entity.Partecipazione;
import it.lumen.data.entity.Utente;
import it.lumen.security.JwtUtil;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.hibernate.validator.internal.constraintvalidators.bv.EmailValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller per la gestione delle partecipazione agli eventi.
 */
@RestController
@RequestMapping("/partecipazione")
public class PartecipazioneEventoControl {

    @Autowired
    private PartecipazioneEventoService partecipazioneEventoService;

    @Autowired
    private AutenticazioneService autenticazioneService;

    @Autowired
    private JwtUtil util;

	/**
	 * Aggiunta di un volontario alla lista partecipazione di un evento.
     * @param token Token JWT per verificare e prendere l'oggetto utente.
	 * @param idEvento id dell'evento
	 *
     * @return Una ResponseEntity con l'esito dell'operazione.
	 */
    @GetMapping("/aggiungi")
    public ResponseEntity<String> aggiungiPartecipazione(@RequestParam String token, @RequestParam int idEvento) {

        String ruolo = util.extractRuolo(token);
        String email = util.extractEmail(token);

        Evento evento = partecipazioneEventoService.getEventoById(idEvento);
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

            Partecipazione partecipazione = new Partecipazione();
            partecipazione.setEvento(evento);
            partecipazione.setVolontario(volontario);

            List<Partecipazione> listaPartecipazioniEvento = partecipazioneEventoService
                    .listaPartecipazioni(evento.getIdEvento());

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
            return new ResponseEntity<>("Errore interno del server: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

	/**
	 * Modifica della partecipazione di un volontario.
	 * @param nuovaPartecipazione Oggetto partecipazione che sostituisce l'attuale partecipazione del volontario.
     * @param token Token JWT per verificare e prendere l'oggetto utente.
	 * 
     * @return Una ResponseEntity con l'esito dell'operazione.
	 */
    @PostMapping("/modifica")
    public ResponseEntity<String> modificaPartecipazione(@RequestBody Partecipazione nuovaPartecipazione,
            @RequestParam String token) {

        String ruolo = util.extractRuolo(token);
        String email = util.extractEmail(token);

        Utente volontarioRichiedente = autenticazioneService.getUtente(email);

        try {
            if (volontarioRichiedente == null) {
                return new ResponseEntity<>("Utente non trovato", HttpStatus.BAD_REQUEST);
            }
            if (!"Volontario".equalsIgnoreCase(ruolo)) {
                return new ResponseEntity<>("Utente deve essere volontario per modificare la partecipazione",
                        HttpStatus.BAD_REQUEST);
            }

            Partecipazione partecipazioneEsistente = partecipazioneEventoService
                    .getPartecipazioneById(nuovaPartecipazione.getIdPartecipazione());

            if (partecipazioneEsistente == null) {
                return new ResponseEntity<>("Partecipazione non trovata", HttpStatus.NOT_FOUND);
            }

            if (!partecipazioneEsistente.getVolontario().getEmail().equals(email)) {
                return new ResponseEntity<>("Non hai i permessi per modificare questa partecipazione",
                        HttpStatus.FORBIDDEN);
            }

            partecipazioneEsistente.setData(new Date(System.currentTimeMillis()));

            partecipazioneEventoService.modificaPartecipazione(partecipazioneEsistente);
            return new ResponseEntity<>("Modifica avvenuta con successo", HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Errore interno del server: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

	/**
	 * Rimozione della partecipazione di un volontario da un evento.
	 * @param partecipazioneInput Oggetto partecipazione da eliminare.
     * @param token Token JWT per verificare e prendere l'oggetto utente.
	 * 
     * @return Una ResponseEntity con l'esito dell'operazione.
	 */
    @PostMapping("/rimuovi")
    public ResponseEntity<String> eliminaPartecipazione(@RequestBody Partecipazione partecipazioneInput,
            @RequestParam String token) {

        String ruolo = util.extractRuolo(token);
        String email = util.extractEmail(token);

        Utente volontarioRichiedente = autenticazioneService.getUtente(email);

        try {
            if (volontarioRichiedente == null) {
                return new ResponseEntity<>("Utente non trovato", HttpStatus.BAD_REQUEST);
            }
            if (!"Volontario".equalsIgnoreCase(ruolo)) {
                return new ResponseEntity<>("Utente deve essere volontario per eliminare la partecipazione",
                        HttpStatus.BAD_REQUEST);
            }

            Partecipazione partecipazioneDaEliminare = partecipazioneEventoService
                    .getPartecipazioneById(partecipazioneInput.getIdPartecipazione());

            if (partecipazioneDaEliminare == null) {
                return new ResponseEntity<>("Partecipazione non trovata", HttpStatus.NOT_FOUND);
            }

            if (!partecipazioneDaEliminare.getVolontario().getEmail().equals(email)) {
                return new ResponseEntity<>("Non hai i permessi per eliminare questa partecipazione",
                        HttpStatus.FORBIDDEN);
            }

            partecipazioneEventoService.eliminaPartecipazione(partecipazioneDaEliminare.getIdPartecipazione());
            return new ResponseEntity<>("Eliminazione partecipazione avvenuta con successo", HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Errore interno del server: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

	/**
	 * Recupero di una lista delle partecipazioni di un evento.
	 * @param eventoInput Evento da cui prendere le partecipazioni.
     * @param token Il token JWT dell'utente autenticato per verificare
     *              l'identità.
	 * 
     * @return Una ResponseEntity con la lista delle partecipazioni.
	 */
    @PostMapping("/visualizzaPartecipazioniEvento")
    public ResponseEntity<?> visualizzaPartecipazioniEvento(@RequestBody Evento eventoInput,
            @RequestParam String token) {

        String email = util.extractEmail(token);
        String ruolo = util.extractRuolo(token);

        if (email == null) {
            return new ResponseEntity<>("Token non valido", HttpStatus.UNAUTHORIZED);
        }

        if (!"ente".equalsIgnoreCase(ruolo)) {
            return new ResponseEntity<>("Utente deve essere ente per visualizzare le partecipazioni evento",
                    HttpStatus.BAD_REQUEST);
        }

        try {
            Evento evento = partecipazioneEventoService.getEventoById(eventoInput.getIdEvento());
            Utente ente = autenticazioneService.getUtente(email);

            if (evento == null) {
                return new ResponseEntity<>("Evento non trovato", HttpStatus.BAD_REQUEST);
            }

            if (!evento.getUtente().equals(ente)) {
                return new ResponseEntity<>("Impossibile visualizzare partecipazioni di eventi non propri",
                        HttpStatus.UNAUTHORIZED);
            }

            List<Partecipazione> lista = partecipazioneEventoService.listaPartecipazioni(evento.getIdEvento());
            return ResponseEntity.ok(lista);

        } catch (Exception e) {
            return new ResponseEntity<>("Errore interno del server: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

	/**
	 * Recupero della cronologia delle partecipazioni effettuate di un volontario.
     * @param token Il token JWT dell'utente autenticato per verificarne
     *              l'identità e recuperarne l'email.
	 * 
     * @return Una ResponseEntity con la lista delle partecipazioni effettuate in precedenza.
	 */
    @PostMapping("/cronologiaPartecipazioni")
    public ResponseEntity<?> visualizzaCronologiaPartecipazioni(@RequestParam String token) {
        if (token.isEmpty()) {
            return new ResponseEntity<>("Token non valido", HttpStatus.UNAUTHORIZED);
        }

        String email;
        String ruolo;

        if (token.contains("@")) {
            email = token;
            Utente utente = autenticazioneService.getUtente(email);
            if (utente == null) {
                return new ResponseEntity<>("Utente non trovato", HttpStatus.BAD_REQUEST);
            }
            ruolo = utente.getRuolo().name();
        } else {
            email = util.extractEmail(token);
            ruolo = util.extractRuolo(token);
        }

        if (!"volontario".equalsIgnoreCase(ruolo)) {
            return new ResponseEntity<>("Utente deve essere volontario per avere una cronologia di partecipazioni",
                    HttpStatus.BAD_REQUEST);
        }

        try {
            List<PartecipazioneDTO> cronologia = partecipazioneEventoService.cronologiaPartecipazioni(email);
            return ResponseEntity.ok(cronologia);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    "Errore interno del server: \n---ERRORE NELLA CREAZIONE DELLA CRONOLOGIA---\n" + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

	/**
	 * Controlla se il volontario partecipa ad un evento.
	 *
	 * @param idEvento id dell'evento preso dall'url.
     * @param token Il token JWT dell'utente autenticato per verificarne
     *              l'identità e recuperarne l'email.
	 *
	 * @return Una ResponseEntity con una variabile booleana.
	 */
    @GetMapping("/checkIscrizione/{idEvento}")
    public ResponseEntity<Map<String, Object>> checkIscrizione(@PathVariable Integer idEvento,
            @RequestParam String token) {
        String email = util.extractEmail(token);

        if (email == null)
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);

        // Recupera la lista lato server (non esce dal backend)
        List<Partecipazione> lista = partecipazioneEventoService.listaPartecipazioni(idEvento);

        // Cerca la corrispondenza
        Optional<Partecipazione> partecipazione = lista.stream()
                .filter(p -> p.getVolontario().getEmail().equals(email))
                .findFirst();

        Map<String, Object> response = new HashMap<>();
        if (partecipazione.isPresent()) {
            response.put("isParticipating", true);
            response.put("idPartecipazione", partecipazione.get().getIdPartecipazione());
        } else {
            response.put("isParticipating", false);
            response.put("idPartecipazione", null);
        }

        return ResponseEntity.ok(response);
    }

}
