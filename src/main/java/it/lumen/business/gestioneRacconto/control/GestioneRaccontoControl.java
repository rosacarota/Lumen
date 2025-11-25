package it.lumen.business.gestioneRacconto.control;

import it.lumen.business.gestioneRacconto.service.GestioneRaccontoService;
import it.lumen.data.dao.RaccontoDAO;
import it.lumen.data.dao.UtenteDAO;
import it.lumen.data.dto.RaccontoDTO;
import it.lumen.data.entity.Racconto;
import it.lumen.data.entity.Utente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.sql.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/racconto")
public class GestioneRaccontoControl {


    @Autowired
    private GestioneRaccontoService gestioneRaccontoService;

    @PostMapping("/aggiungi")
    public ResponseEntity<String> aggiuntaRacconto(@RequestBody Racconto racconto) {

        try {

            /*
            if (result.hasErrors()) {
                StringBuilder errorMsg = new StringBuilder("Errori di validazione:");
                result.getAllErrors().forEach(e -> errorMsg.append(" ").append(e.getDefaultMessage()));
                return ResponseEntity.badRequest().body(errorMsg.toString());
            }
            */

            if (racconto.getTitolo() == null) {

                return new ResponseEntity<>("Titolo non può essere vuoto", HttpStatus.BAD_REQUEST);
            }

            if (racconto.getDescrizione() == null) {

                return new ResponseEntity<>("Descrizione non può essere vuota", HttpStatus.BAD_REQUEST);
            }


            if (racconto.getUtente() == null) {

                return new ResponseEntity<>("Email dell'utente non può essere vuota", HttpStatus.BAD_REQUEST);
            }

            // dovrei controllare anche che l'utente esista o lo prendo dalla sessione?

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
    public ResponseEntity<String> modificaRacconto(@RequestBody Racconto nuovoRacconto) {

        try {
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


            if (nuovoRacconto.getUtente() == null) {

                return new ResponseEntity<>("Email dell'utente non può essere vuota", HttpStatus.BAD_REQUEST);
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



        raccontoDaModificare.setTitolo(nuovoRacconto.getTitolo());
        raccontoDaModificare.setDescrizione(nuovoRacconto.getDescrizione());
        raccontoDaModificare.setImmagine(nuovoRacconto.getImmagine());
*/

// check per vedere se email del racconto corrisponde ad email in sessione
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
    public ResponseEntity<String> rimuoviRacconto(@RequestBody Map<String, Integer> body) {


try {
    Integer idRacconto=body.get("idRacconto");
    if (idRacconto == null) {
        return new ResponseEntity<>("IdRacconto non può essere vuoto", HttpStatus.BAD_REQUEST);

    }

    if (!gestioneRaccontoService.checkId(idRacconto)) {
        return new ResponseEntity<>("Racconto da eliminare non trovato", HttpStatus.NOT_FOUND);
    }

    // check per vedere se email del racconto corrisponde ad email in sessione

        gestioneRaccontoService.eliminaRacconto(idRacconto);
        return new ResponseEntity<>("Racconto eliminato con successo.", HttpStatus.OK);
    } catch (Exception e) {
        return new ResponseEntity<>("Errore interno del server " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    }


    @PostMapping("/visualizza")
    public ResponseEntity<List<Racconto>> visualizzaRaccontiUtente(@RequestBody Map<String, String> body) {

        String email=body.get("email");
        List<Racconto> lista = gestioneRaccontoService.listaRaccontiUtente(email);

        return ResponseEntity.ok(lista);

    }

}

