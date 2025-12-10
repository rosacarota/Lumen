package it.lumen.business.gestioneAccount.control;

import it.lumen.business.gestioneAccount.service.GestioneAccountService;
import it.lumen.business.gestioneRegistrazione.service.RegistrazioneService;
import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.data.entity.Indirizzo;
import it.lumen.data.entity.Utente;
import it.lumen.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;

/**
 * Controller REST per la gestione delle operazioni relative all'account
 * dell'utente,
 * come il recupero dei dati personali e la modifica del profilo.
 */
@RestController
@RequestMapping("/account")
public class GestioneAccountControl {
    private final AutenticazioneService autenticazioneService;
    private final JwtUtil jwtUtil;
    private final GestioneAccountService gestioneAccountService;
    private final RegistrazioneService registrazioneService;

    /**
     * Costruttore per l'iniezione delle dipendenze.
     *
     * @param autenticazioneService  Servizio per l'autenticazione.
     * @param jwtUtil                Utility per la gestione dei JWT.
     * @param gestioneAccountService Servizio per la gestione dell'account.
     * @param registrazioneService   Servizio per la registrazione (usato per
     *                               salvare immagini).
     */
    @Autowired
    public GestioneAccountControl(AutenticazioneService autenticazioneService, JwtUtil jwtUtil,
            GestioneAccountService gestioneAccountService, RegistrazioneService registrazioneService) {
        this.autenticazioneService = autenticazioneService;
        this.jwtUtil = jwtUtil;
        this.gestioneAccountService = gestioneAccountService;
        this.registrazioneService = registrazioneService;
    }

    /**
     * Recupera i dati dell'utente autenticato tramite token.
     *
     * @param token Il token JWT dell'utente.
     * @return Una ResponseEntity contenente l'oggetto Utente con i dati recuperati
     *         (inclusa l'immagine in base64).
     */
    @GetMapping("/datiUtente")
    public ResponseEntity<?> datiUtente(@RequestParam String token) {

        String email = jwtUtil.extractEmail(token);

        Utente utente = autenticazioneService.getUtente(email);

        try {
            utente.setImmagine(autenticazioneService.recuperaImmagine(utente.getImmagine()));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.status(HttpStatus.OK).body(utente);
    }

    /**
     * Modifica i dati dell'utente autenticato.
     *
     * @param utenteDTO Oggetto Utente con i nuovi dati.
     * @param token     Il token JWT dell'utente autenticato per verificare
     *                  l'identità.
     * @return Una ResponseEntity con l'esito dell'operazione.
     */
    @PostMapping("/modificaUtente")
    public ResponseEntity<?> modificaUtente(@RequestBody Utente utenteDTO, @RequestParam String token) {
        String email = jwtUtil.extractEmail(token);

        if (!email.equals(utenteDTO.getEmail())) {
            return new ResponseEntity<>("Puoi modificare solo il tuo account", HttpStatus.BAD_REQUEST);
        }

        Indirizzo indirizzoUtente = utenteDTO.getIndirizzo();

        if (utenteDTO.getAmbito().length()>100){
            return new ResponseEntity<>("Ambito non valido", HttpStatus.BAD_REQUEST);
        }

        Utente utente = autenticazioneService.getUtente(email);

        if (utenteDTO.getNome() != null && utenteDTO.getNome().length() <= 100) {
            utente.setNome(utenteDTO.getNome());
        } else {
            return new ResponseEntity<>("Nome non valido", HttpStatus.BAD_REQUEST);
        }

        if(utenteDTO.getRuolo() != Utente.Ruolo.Ente && (utenteDTO.getCognome() != null && utenteDTO.getCognome().length() <= 100)){
            utente.setCognome(utenteDTO.getCognome());
        } else {
            return new ResponseEntity<>("Cognome non valido", HttpStatus.BAD_REQUEST);
        }

        if(utenteDTO.getRecapitoTelefonico() != null && utenteDTO.getRecapitoTelefonico().matches("^\\d{10}$")) {
            utente.setRecapitoTelefonico(utenteDTO.getRecapitoTelefonico());
        } else {
            return new ResponseEntity<>("Numero di telefono non valido", HttpStatus.BAD_REQUEST);
        }
        utente.setDescrizione(utenteDTO.getDescrizione());

        String base64String = utenteDTO.getImmagine();
        if (base64String != null && !base64String.isEmpty()) {
            String[] parts = base64String.split(",");
            String header = parts[0];

            if (!header.contains("image/png") && !header.contains("image/jpeg") && !header.contains("image/jpg") && !header.contains("image/gif")) {
                return new ResponseEntity<>("Formato non valido (ammessi: JPG, PNG, GIF, WEBP)", HttpStatus.BAD_REQUEST);
            }
            utente.setImmagine(base64String);
        }
        if (indirizzoUtente.getCap() == null || !indirizzoUtente.getCap().matches("^\\d{5}$")){
            return new ResponseEntity<>("Cap non valido", HttpStatus.BAD_REQUEST);
        }

        if(indirizzoUtente.getProvincia().length()>50){
            return new ResponseEntity<>("Provincia non valida", HttpStatus.BAD_REQUEST);
        }

        if (indirizzoUtente.getCitta().length()>100) {
            return new ResponseEntity<>("Citta non valida", HttpStatus.BAD_REQUEST);
        }

        if (indirizzoUtente.getStrada().length()>255){
            return new ResponseEntity<>("Strada non valida", HttpStatus.BAD_REQUEST);
        }

        if (indirizzoUtente.getNCivico() == null || indirizzoUtente.getNCivico() < 0){
            return new ResponseEntity<>("Numero civico non valido", HttpStatus.BAD_REQUEST);
        }


        utente.setIndirizzo(utenteDTO.getIndirizzo());

        gestioneAccountService.modificaUtente(utente);

        return new ResponseEntity<>("Puoi modificare solo il tuo account", HttpStatus.OK);

    }
}
