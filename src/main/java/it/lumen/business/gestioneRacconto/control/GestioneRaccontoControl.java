package it.lumen.business.gestioneRacconto.control;

import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.business.gestioneRacconto.service.GestioneRaccontoService;
import it.lumen.data.entity.Racconto;
import it.lumen.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.sql.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/racconto")
public class GestioneRaccontoControl {

    private final GestioneRaccontoService gestioneRaccontoService;
    private final JwtUtil util;
    private final AutenticazioneService autenticazioneService;

    public GestioneRaccontoControl(GestioneRaccontoService gestioneRaccontoService, JwtUtil util, AutenticazioneService autenticazioneService) {
            this.gestioneRaccontoService = gestioneRaccontoService;
            this.util = util;
            this.autenticazioneService = autenticazioneService;
    }


        @PostMapping("/aggiungi")
    public ResponseEntity<String> aggiuntaRacconto(@RequestBody Racconto racconto, @RequestParam String token) {

        try {

           String email= util.extractEmail(token);

            if (email == null) {

                return new ResponseEntity<>("Email dell'utente non può essere vuota", HttpStatus.BAD_REQUEST);
            }

            if (racconto.getTitolo() == null) {

                return new ResponseEntity<>("Titolo non può essere vuoto", HttpStatus.BAD_REQUEST);
            }

            if (racconto.getDescrizione() == null) {

                return new ResponseEntity<>("Descrizione non può essere vuota", HttpStatus.BAD_REQUEST);
            }


            racconto.setUtente(autenticazioneService.getUtente(email));
            racconto.setDataPubblicazione(new Date(System.currentTimeMillis()));
            Racconto raccontoAggiunto = gestioneRaccontoService.aggiungiRacconto(racconto);
            if (raccontoAggiunto != null) {
                return new ResponseEntity<>("Aggiunta del racconto avvenuta con successo.", HttpStatus.CREATED);

            } else {

                return new ResponseEntity<>("Si è verificato un errore nell'aggiunta del racconto.", HttpStatus.BAD_REQUEST);
            }

        } catch (Exception e) {
            return new ResponseEntity<>("Errore interno del server " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("/modifica")
    public ResponseEntity<String> modificaRacconto(@RequestBody Racconto nuovoRacconto, @RequestParam String token) {

        try {
            String email= util.extractEmail(token);

            if (email == null) {

                return new ResponseEntity<>("Email dell'utente non può essere vuota", HttpStatus.BAD_REQUEST);
            }

            Integer idRacconto=nuovoRacconto.getIdRacconto();
            if (idRacconto == null) {
                return new ResponseEntity<>("IdRacconto non può essere vuoto", HttpStatus.BAD_REQUEST);

            }

            if (nuovoRacconto.getTitolo() == null) {

                return new ResponseEntity<>("Titolo non può essere vuoto", HttpStatus.BAD_REQUEST);
            }

            if (nuovoRacconto.getDescrizione() == null) {

                return new ResponseEntity<>("Descrizione non può essere vuota", HttpStatus.BAD_REQUEST);
            }

            if(nuovoRacconto.getDataPubblicazione()==null) {

                return new ResponseEntity<>("Data di pubblicazione del racconto non può essere vuota", HttpStatus.BAD_REQUEST);
            }

            if (!gestioneRaccontoService.checkId(idRacconto)) {
                return new ResponseEntity<>("Racconto da modificare non trovato", HttpStatus.NOT_FOUND);
            }
/*
        if (nuovoRacconto.getUtente() != null &&
                !nuovoRacconto.getUtente().getEmail().equals(raccontoDaModificare.getUtente().getEmail())) {
            return new ResponseEntity<>("Non è possibile modificare l'utente del racconto.", HttpStatus.FORBIDDEN);
        }
*/

            if(!gestioneRaccontoService.getByIdRacconto(idRacconto).getUtente().getEmail().equals(email)) {

                return new ResponseEntity<>("Non puoi modificare il racconto.", HttpStatus.FORBIDDEN);
            }

            nuovoRacconto.setUtente(autenticazioneService.getUtente(email));
            Racconto raccontoModificato = gestioneRaccontoService.modificaRacconto(nuovoRacconto);
            if (raccontoModificato != null) {
                return new ResponseEntity<>("Modifica del racconto avvenuta con successo.", HttpStatus.CREATED);

            } else {

                return new ResponseEntity<>("Si è verificato un errore nella modifica del racconto.", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {

            return new ResponseEntity<>("Errore interno del server " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


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

    if(!gestioneRaccontoService.getByIdRacconto(idRacconto).getUtente().getEmail().equals(email)) {

        return new ResponseEntity<>("Non puoi eliminare il racconto.", HttpStatus.FORBIDDEN);

    }

        gestioneRaccontoService.eliminaRacconto(idRacconto);
        return new ResponseEntity<>("Racconto eliminato con successo.", HttpStatus.OK);
    } catch (Exception e) {
        return new ResponseEntity<>("Errore interno del server " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    }


    @PostMapping("/visualizza")
    public ResponseEntity<List<Racconto>> visualizzaRaccontiUtente(@RequestParam String token) {

        String email= util.extractEmail(token);

        if (email == null) {

            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<Racconto> lista = gestioneRaccontoService.listaRaccontiUtente(email);

        return ResponseEntity.ok(lista);

    }

}

