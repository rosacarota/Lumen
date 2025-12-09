package it.lumen.business.gestioneRacconto.control;

import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.business.gestioneRacconto.service.GestioneRaccontoService;
import it.lumen.data.entity.Racconto;
import it.lumen.data.entity.Utente;
import it.lumen.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.Date;
import java.util.List;
import java.util.Map;

/**
 * Controller REST per la gestione delle operazioni relative ai racconti,
 * come la pubblicazione, modifica, eliminazione e visualizzazione dei racconti dell'utente.
 */
@RestController
@RequestMapping("/racconto")
public class GestioneRaccontoControl {

    private final GestioneRaccontoService gestioneRaccontoService;
    private final JwtUtil util;
    private final AutenticazioneService autenticazioneService;
    private final JwtUtil jwtUtil;

    /**
     * Costruttore per l'iniezione delle dipendenze.
     *
     * @param gestioneRaccontoService  Servizio per la gestione dei racconti.
     * @param jwtUtil                Utility per la gestione dei JWT.
     * @param autenticazioneService Servizio per la gestione dell'autenticazione.
     */
    public GestioneRaccontoControl(GestioneRaccontoService gestioneRaccontoService, JwtUtil util, AutenticazioneService autenticazioneService, JwtUtil jwtUtil) {
            this.gestioneRaccontoService = gestioneRaccontoService;
            this.util = util;
            this.autenticazioneService = autenticazioneService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Pubblicazione di un racconto di un utente autenticato tramite token.
     *
     * @param racconto Oggetto Racconto contenente i dati del racconto.
     * @param token Il token JWT dell'utente.
     * @return Una ResponseEntity contenente l'oggetto Racconto
     *         (inclusa l'immagine in base64).
     */
    @PostMapping("/aggiungi")
    public ResponseEntity<Racconto> aggiuntaRacconto(@RequestBody Racconto racconto, @RequestParam String token) {
        try {
            String email = util.extractEmail(token);

            if (email == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            if (racconto.getTitolo() == null || racconto.getDescrizione() == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            racconto.setUtente(autenticazioneService.getUtente(email));
            racconto.setDataPubblicazione(new Date(System.currentTimeMillis()));
            Racconto raccontoAggiunto = gestioneRaccontoService.aggiungiRacconto(racconto);

            if (raccontoAggiunto != null) {
                return new ResponseEntity<>(raccontoAggiunto, HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * Modifica di un racconto di un utente autenticato tramite token.
     *
     * @param nuovoRacconto Oggetto Racconto con i nuovi dati.
     * @param token Il token JWT dell'utente per verificare l'identità dell'utente.
     * @return Una ResponseEntity contenente l'oggetto Racconto modificato
     *         (inclusa l'immagine in base64).
     */
    @PostMapping("/modifica")
    public ResponseEntity<Racconto> modificaRacconto(@RequestBody Racconto nuovoRacconto, @RequestParam String token) {
        try {
            String email = util.extractEmail(token);

            if (email == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            Integer idRacconto = nuovoRacconto.getIdRacconto();
            if (idRacconto == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            if (nuovoRacconto.getTitolo() == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            if (nuovoRacconto.getDescrizione() == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            if (nuovoRacconto.getDataPubblicazione() == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            if (!gestioneRaccontoService.checkId(idRacconto)) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            if (!gestioneRaccontoService.getByIdRaccontoRaw(idRacconto).getUtente().getEmail().equals(email)) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }

            nuovoRacconto.setUtente(autenticazioneService.getUtente(email));
            Racconto raccontoModificato = gestioneRaccontoService.modificaRacconto(nuovoRacconto);

            if (raccontoModificato != null) {
                return new ResponseEntity<>(raccontoModificato, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * Eliminazione di un racconto di un utente autenticato tramite token.
     *
     * @param body Mappa contenente l'identificativo dell'oggetto Racconto da eliminare.
     * @param token Il token JWT dell'utente per verificare l'identità dell'utente.
     * @return Una ResponseEntity contenente l'esito dell'operazione.
     */
    @PostMapping("/rimuovi")
    public ResponseEntity<String> rimuoviRacconto(@RequestBody Map<String, Integer> body, @RequestParam String token) {


try {

    String email= util.extractEmail(token);

    if (email == null) {

        return new ResponseEntity<>("Email dell'utente non può essere vuota", HttpStatus.BAD_REQUEST);
    }

    Integer idRacconto=body.get("idRacconto");
    if (idRacconto == null) {
        return new ResponseEntity<>("IdRacconto non può essere vuoto", HttpStatus.BAD_REQUEST);

    }

    if (!gestioneRaccontoService.checkId(idRacconto)) {
        return new ResponseEntity<>("Racconto da eliminare non trovato", HttpStatus.NOT_FOUND);
    }


    if(!gestioneRaccontoService.getByIdRaccontoRaw(idRacconto).getUtente().getEmail().equals(email)) {

        return new ResponseEntity<>("Non puoi eliminare il racconto.", HttpStatus.FORBIDDEN);

    }

        gestioneRaccontoService.eliminaRacconto(idRacconto);
        return new ResponseEntity<>("Racconto eliminato con successo.", HttpStatus.OK);
    } catch (Exception e) {
        return new ResponseEntity<>("Errore interno del server " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    }


    /**
     * Visualizzazione dei racconti di un utente autenticato tramite token.
     *
     * @param emailParam Mappa contenente l'email dell'utente che ha pubblicato i racconti.
     * @param token Il token JWT dell'utente per verificare l'identità dell'utente.
     * @return Una ResponseEntity contenente la lista dei racconti dell'utente.
     */
    @PostMapping("/visualizza")
    public ResponseEntity<List<Racconto>> visualizzaRaccontiUtente(@RequestParam String token, @RequestBody Map<String, String> emailParam) {

        String loggedemail= util.extractEmail(token);
        String email = emailParam.get("email");
        if (loggedemail == null) {

            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if(email ==  null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }



        List<Racconto> lista = gestioneRaccontoService.listaRaccontiUtente(email);
        try {
            for  (Racconto racconto : lista) {
                Utente utente = racconto.getUtente();
                utente.setImmagine(autenticazioneService.recuperaImmagine(utente.getImmagine()));
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.ok(lista);

    }

    /**
     * Visualizzazione da parte di un utente di tutti i racconti.
     * @param token Il token JWT dell'utente per verificare l'identità dell'utente.
     */
    @GetMapping("/visualizzaTutti")
    public ResponseEntity<List<Racconto>>  visualizzaTuttiRacconti(@RequestParam String token) {

        if(jwtUtil.extractEmail(token) == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        List<Racconto> lista = gestioneRaccontoService.listaRacconti();
        for(Racconto r : lista) {
            Utente utente = r.getUtente();
            try {
                utente.setImmagine(autenticazioneService.recuperaImmagine(utente.getImmagine()));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        return ResponseEntity.ok(lista);
    }

}

