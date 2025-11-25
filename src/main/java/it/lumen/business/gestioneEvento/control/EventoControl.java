package it.lumen.business.gestioneEvento.control;


import it.lumen.business.gestioneEvento.service.EventoService;
import it.lumen.data.entity.Evento;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/evento")
public class EventoControl {



    @Autowired
    private EventoService gestioneEventoService;



    @PostMapping("/aggiungiEvento")
    public ResponseEntity<String> aggiuntaEvento(@RequestBody Evento evento) {

        try {

            if(evento.getTitolo()==null) {

                return new ResponseEntity<>("Titolo non può essere vuoto", HttpStatus.BAD_REQUEST);
            }

            if(evento.getDescrizione()==null) {

                return new ResponseEntity<>("Descrizione non può essere vuota", HttpStatus.BAD_REQUEST);
            }

            if(evento.getIndirizzo()==null) {

                return new ResponseEntity<>("Luogo non può essere vuoto", HttpStatus.BAD_REQUEST);
            }

            if(evento.getDataFine()==null){

                return new ResponseEntity<>("Data di fine non può essere vuota", HttpStatus.BAD_REQUEST);
            }

            if(evento.getUtente()==null) {

                return new ResponseEntity<>("Email dell'utente non può essere vuota", HttpStatus.BAD_REQUEST);
            }


            if(evento.getDataInizio()==null){

                return new ResponseEntity<>("Data di inizio non può essere vuota", HttpStatus.BAD_REQUEST);
            }
            Evento eventoSalvato= gestioneEventoService.aggiungiEvento(evento);
            if (eventoSalvato != null) {

                return new ResponseEntity<>("Aggiunta dell'evento avvenuta con successo.", HttpStatus.CREATED);

            } else {

                return new ResponseEntity<>("Si è verificato un errore nell'aggiunta dell'evento.", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {

            return new ResponseEntity<>("Errore interno del server " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/modificaEvento")
    public ResponseEntity<String> modificaEvento( @RequestBody Evento nuovoEvento) {


        try {
            Integer idEvento=nuovoEvento.getIdEvento();
            if (idEvento == null) {
                return new ResponseEntity<>("IdEvento non può essere vuoto", HttpStatus.BAD_REQUEST);

            }


            if(nuovoEvento.getTitolo()==null) {

                return new ResponseEntity<>("Titolo non può essere vuoto", HttpStatus.BAD_REQUEST);
            }

            if(nuovoEvento.getDescrizione()==null) {

                return new ResponseEntity<>("Descrizione non può essere vuota", HttpStatus.BAD_REQUEST);
            }

            if(nuovoEvento.getIndirizzo()==null) {

                return new ResponseEntity<>("Luogo non può essere vuoto", HttpStatus.BAD_REQUEST);
            }

            if(nuovoEvento.getDataFine()==null){

                return new ResponseEntity<>("Data di fine non può essere vuota", HttpStatus.BAD_REQUEST);
            }


            if(nuovoEvento.getUtente()==null) {

                return new ResponseEntity<>("Email dell'utente non può essere vuota", HttpStatus.BAD_REQUEST);
            }

            if(nuovoEvento.getDataInizio()==null) {

                return new ResponseEntity<>("Data di inizio evento non può essere vuota", HttpStatus.BAD_REQUEST);
            }

            if (!gestioneEventoService.checkId(idEvento)) {
                return new ResponseEntity<>("Evento da modificare non trovato", HttpStatus.NOT_FOUND);
            }

            Evento eventoModificato= gestioneEventoService.modificaEvento(nuovoEvento);


            if(eventoModificato!=null) {
                return new ResponseEntity<>("Modifica dell'evento avvenuta con successo.", HttpStatus.CREATED);

            } else {

                return new ResponseEntity<>("Si è verificato un errore nella modifica dell'evento.", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {

            return new ResponseEntity<>("Errore interno del server " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    @PostMapping("/rimuoviEvento")
    public ResponseEntity<String> rimuoviEvento(@RequestBody Map<String, Integer> body) {

        try {
            Integer idEvento=body.get("idEvento");
            if (idEvento == null) {
                return new ResponseEntity<>("IdEvento non può essere vuoto", HttpStatus.BAD_REQUEST);

            }

            if (!gestioneEventoService.checkId(idEvento)) {
                return new ResponseEntity<>("Evento da eliminare non trovato", HttpStatus.NOT_FOUND);
            }
       gestioneEventoService.eliminaEvento(idEvento);



            return new ResponseEntity<>("Evento eliminato con successo.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Errore interno del server " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping("/cronologiaEventi")
    public ResponseEntity<List<Evento>> cronologiaEvento(@RequestBody Map<String, String> body) {


        String email=body.get("email");
        if(email==null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        }

        List<Evento> listaEventi = gestioneEventoService.cronologiaEventi(email);

        if(listaEventi.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }



        return ResponseEntity.ok(listaEventi);

    }


}
