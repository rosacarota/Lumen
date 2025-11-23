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
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.sql.Date;

@RestController
@RequestMapping("/racconto")
public class GestioneRaccontoControl {

    @Autowired
    private RaccontoDAO raccontoDAO;

    @Autowired
    private GestioneRaccontoService gestioneRaccontoService;


    @PostMapping("/aggiungi")
    public ResponseEntity<String> aggiuntaRacconto(@RequestBody Racconto racconto) {

        try {

            if(racconto.getTitolo()==null) {

                return new ResponseEntity<>("Titolo non può essere vuoto", HttpStatus.BAD_REQUEST);
            }

            if(racconto.getDescrizione()==null) {

                return new ResponseEntity<>("Descrizione non può essere vuota", HttpStatus.BAD_REQUEST);
            }

            if(racconto.getUtente()==null) {

                return new ResponseEntity<>("Email dell'utente non può essere vuota", HttpStatus.BAD_REQUEST);
            }

            racconto.setDataPubblicazione(new Date(System.currentTimeMillis()));
            Racconto raccontoSalvato = gestioneRaccontoService.aggiungiRacconto(racconto);
            if (raccontoSalvato != null) {

                return new ResponseEntity<>("Aggiunta del racconto avvenuta con successo.", HttpStatus.CREATED);

            } else {

                return new ResponseEntity<>("Si è verificato un errore nell'aggiunta del racconto.", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {

            return new ResponseEntity<>("Errore interno del server " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/modifica")
    public ResponseEntity<String> modificaRacconto(@RequestParam Integer idRacconto, @RequestBody Racconto nuovoRacconto) {

        try {

            if(nuovoRacconto.getTitolo()==null) {

                return new ResponseEntity<>("Titolo non può essere vuoto", HttpStatus.BAD_REQUEST);
            }

            if(nuovoRacconto.getDescrizione()==null) {

                return new ResponseEntity<>("Descrizione non può essere vuota", HttpStatus.BAD_REQUEST);
            }

            if(nuovoRacconto.getUtente()==null) {

                return new ResponseEntity<>("Email dell'utente non può essere vuota", HttpStatus.BAD_REQUEST);
            }

        Racconto raccontoDaModificare= raccontoDAO.getRaccontoByIdRacconto(idRacconto);

        if(raccontoDaModificare==null) {

            return new ResponseEntity<>("Racconto da modificare non trovato.", HttpStatus.NOT_FOUND);
        }

        if (nuovoRacconto.getUtente() != null &&
                !nuovoRacconto.getUtente().getEmail().equals(raccontoDaModificare.getUtente().getEmail())) {
            return new ResponseEntity<>("Non è possibile modificare l'utente del racconto.", HttpStatus.FORBIDDEN);
        }



        raccontoDaModificare.setTitolo(nuovoRacconto.getTitolo());
        raccontoDaModificare.setDescrizione(nuovoRacconto.getDescrizione());
        raccontoDaModificare.setImmagine(nuovoRacconto.getImmagine());

        Racconto raccontoModificato=gestioneRaccontoService.modificaRacconto(raccontoDaModificare);
        if(raccontoModificato!=null) {
            return new ResponseEntity<>("Modifica del racconto avvenuta con successo.", HttpStatus.CREATED);

        } else {

            return new ResponseEntity<>("Si è verificato un errore nella modifica del racconto.", HttpStatus.BAD_REQUEST);
        }
    } catch (Exception e) {

        return new ResponseEntity<>("Errore interno del server " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

        }


    @PostMapping("/rimuovi")
    public ResponseEntity<String> rimuoviRacconto(@RequestParam @Valid Integer idRacconto) {

        Racconto raccontoDaEliminare=raccontoDAO.getRaccontoByIdRacconto(idRacconto);
        if(raccontoDaEliminare==null) {

            return new ResponseEntity<>("Racconto da eliminare non trovato.", HttpStatus.NOT_FOUND);
        }

        gestioneRaccontoService.eliminaRacconto(idRacconto);
        return new ResponseEntity<>("Racconto eliminato con successo.", HttpStatus.OK);

    }

}
