package it.lumen.business.gestioneRichiesta.control;

import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.business.gestioneRichiesta.service.RichiestaServizioService;
import it.lumen.data.dto.RichiestaServizioDTO;
import it.lumen.data.entity.RichiestaServizio;
import it.lumen.data.entity.Utente;
import it.lumen.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * Controller per la gestione delle richieste di servizio.
 * Gestisce le operazioni CRUD e altre funzionalità relative alle richieste di
 * servizio.
 */
@RestController
@RequestMapping("/richiestaServizio")
public class RichiestaServizioControl {

    @Autowired
    private final RichiestaServizioService richiestaServizioService;
    @Autowired
    private AutenticazioneService autenticazioneService;
    @Autowired
    private final JwtUtil util;

    /**
     * Costruttore per l'iniezione delle dipendenze.
     *
     * @param richiestaServizioService Service per la logica di business delle
     *                                 richieste.
     * @param autenticazioneService    Service per l'autenticazione.
     * @param util                     Utility per la gestione dei token JWT.
     */
    @Autowired
    public RichiestaServizioControl(RichiestaServizioService richiestaServizioService,
            AutenticazioneService autenticazioneService, JwtUtil util) {
        this.richiestaServizioService = richiestaServizioService;
        this.autenticazioneService = autenticazioneService;
        this.util = util;
    }

    /**
     * Crea una nuova richiesta di servizio.
     *
     * @param richiestaServizioDTO DTO contenente i dati della richiesta.
     * @param result               Oggetto per la gestione degli errori di
     *                             validazione.
     * @param token                Token JWT per identificare l'utente richiedente.
     * @return ResponseEntity con messaggio di successo o errore.
     */
    @PostMapping("/creaRichiestaServizio")
    public ResponseEntity<String> creaRichiestaServizio(@RequestBody RichiestaServizioDTO richiestaServizioDTO,
            BindingResult result, String token) {

        String email = util.extractEmail(token);
        richiestaServizioDTO.setBeneficiario(email);
        if (result.hasErrors()) {
            StringBuilder errors = new StringBuilder("Errore di validazione");
            result.getAllErrors().forEach(error -> errors.append(error.getDefaultMessage()));
            return new ResponseEntity<>(errors.toString(), HttpStatus.BAD_REQUEST);
        }
        richiestaServizioService.creaRichiestaServizio(richiestaServizioDTO);
        return ResponseEntity.ok("Richiesta di servizio creata con successo");

        // if (result.hasErrors()) {
        // StringBuilder errorMsg = new StringBuilder("Errori di validazione: ");
        // result.getAllErrors().forEach(error ->
        // errorMsg.append(error.getDefaultMessage()));
        // return ResponseEntity.badRequest().body(errorMsg.toString());
        // }
        // richiestaServizioService.creaRichiestaServizio(richiestaServizio);
        // return ResponseEntity.ok("Richiesta servizio creato");
    }

    /**
     * Accetta una richiesta di servizio esistente.
     *
     * @param richiestaServizio Oggetto RichiestaServizio da accettare.
     * @param result            Oggetto per la gestione degli errori di validazione.
     * @return ResponseEntity con messaggio di successo o errore.
     */
    @PostMapping("/accettaRichiestaServizio")
    public ResponseEntity<String> accettaRichiestaServizio(@Valid @RequestBody RichiestaServizio richiestaServizio,
            BindingResult result) {
        if (result.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder("Errori di validazione: ");
            result.getAllErrors().forEach(error -> errorMsg.append(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorMsg.toString());
        }
        richiestaServizioService.accettaRichiestaServizio(richiestaServizio);
        return ResponseEntity.ok("Richiesta servizio accettata con successo");
    }

    /**
     * Rifiuta una richiesta di servizio esistente.
     *
     * @param richiestaServizio Oggetto RichiestaServizio da rifiutare.
     * @param result            Oggetto per la gestione degli errori di validazione.
     * @return ResponseEntity con messaggio di successo o errore.
     */
    @PostMapping("/rifiutaRichiestaServizio")
    public ResponseEntity<String> rifiutaRichiestaServizio(@Valid @RequestBody RichiestaServizio richiestaServizio,
            BindingResult result) {
        if (result.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder("Errori di validazione: ");
            result.getAllErrors().forEach(error -> errorMsg.append(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorMsg.toString());
        }
        richiestaServizioService.rifiutaRichiestaServizio(richiestaServizio);
        return ResponseEntity.ok("Richiesta servizio rifiutata con successo");
    }

    /**
     * Recupera le richieste di servizio associate a un utente tramite token.
     *
     * @param token Token JWT dell'utente.
     * @return ResponseEntity contenente la lista delle richieste o un messaggio di
     *         errore.
     */
    @GetMapping("/getRichiesteServizio")
    public ResponseEntity<?> getRichiesteByToken(@RequestParam String token) {
        String email = util.extractEmail(token);

        return ResponseEntity.ok(richiestaServizioService.getRichiesteByEmail(email));
    }

    /**
     * Recupera le richieste di servizio in attesa associate a un utente tramite
     * token.
     *
     * @param token Token JWT dell'utente.
     * @return ResponseEntity contenente la lista delle richieste in attesa.
     */
    @GetMapping("/getRichiestaInAttesa")
    public ResponseEntity<List<?>> getRichiestaInAttesa(@RequestParam String token) {
        String email = util.extractEmail(token);

        return ResponseEntity.ok(richiestaServizioService.getRichiesteInAttesaByEmail(email));
    }
}
