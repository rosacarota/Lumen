package it.lumen.business.gestioneEvento.control;


import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.business.gestioneEvento.service.GestioneEventoService;
import it.lumen.data.entity.Evento;
import it.lumen.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;


@RestController
@RequestMapping("/evento")
public class GestioneEventoControl {



    private final GestioneEventoService gestioneEventoService;
    private final JwtUtil util;
    private final AutenticazioneService autenticazioneService;
    public GestioneEventoControl(GestioneEventoService gestioneEventoService, JwtUtil util, AutenticazioneService autenticazioneService) {
        this.gestioneEventoService = gestioneEventoService;
        this.util = util;
        this.autenticazioneService = autenticazioneService;
    }


    @PostMapping("/aggiungiEvento")
    public ResponseEntity<String> aggiuntaEvento(@RequestBody Evento evento, @RequestParam String token) {

        try {
            String email = util.extractEmail(token);


            if (email == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            if (evento.getTitolo() == null || evento.getDescrizione()==null || evento.getIndirizzo()==null || evento.getDataFine()==null || evento.getDataInizio()==null) {

                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            evento.setUtente(autenticazioneService.getUtente(email));
            String path = salvaImmagine(evento.getImmagine());
            evento.setImmagine(path);
            Evento eventoSalvato = gestioneEventoService.aggiungiEvento(evento);
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
    public ResponseEntity<String> modificaEvento(@RequestBody Evento nuovoEvento,  @RequestParam String token) {


        try {
            String email = util.extractEmail(token);

            if (email == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            Integer idEvento = nuovoEvento.getIdEvento();

            if (idEvento == null) {
                return new ResponseEntity<>("IdEvento non può essere vuoto", HttpStatus.BAD_REQUEST);

            }


            if (nuovoEvento.getTitolo() == null || nuovoEvento.getDescrizione()==null || nuovoEvento.getIndirizzo()==null || nuovoEvento.getDataFine()==null || nuovoEvento.getDataInizio()==null) {

                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            if (!gestioneEventoService.checkId(idEvento)) {
                return new ResponseEntity<>("Evento da modificare non trovato", HttpStatus.NOT_FOUND);
            }
            if (!gestioneEventoService.getEventoById(idEvento).getUtente().getEmail().equals(email)) {
                return new ResponseEntity<>("Non puoi modificare l'evento", HttpStatus.FORBIDDEN);
            }

            nuovoEvento.setUtente(autenticazioneService.getUtente(email));
            Evento eventoModificato = gestioneEventoService.modificaEvento(nuovoEvento);


            if (eventoModificato != null) {
                return new ResponseEntity<>("Modifica dell'evento avvenuta con successo.", HttpStatus.CREATED);

            } else {

                return new ResponseEntity<>("Si è verificato un errore nella modifica dell'evento.", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {

            return new ResponseEntity<>("Errore interno del server " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    @PostMapping("/rimuoviEvento")
    public ResponseEntity<String> rimuoviEvento(@RequestBody Map<String, Integer> body, @RequestParam String token) {

        try {
            String email= util.extractEmail(token);
            if (email == null) {

                return new ResponseEntity<>("Email dell'utente non può essere vuota", HttpStatus.BAD_REQUEST);
            }

            Integer idEvento = body.get("idEvento");
            if (idEvento == null) {
                return new ResponseEntity<>("IdEvento non può essere vuoto", HttpStatus.BAD_REQUEST);

            }

            if (!gestioneEventoService.checkId(idEvento)) {
                return new ResponseEntity<>("Evento da eliminare non trovato", HttpStatus.NOT_FOUND);
            }

            if(!gestioneEventoService.getEventoById(idEvento).getUtente().getEmail().equals(email)) {

                return new ResponseEntity<>("Non puoi eliminare l'evento.", HttpStatus.FORBIDDEN);

            }
            gestioneEventoService.eliminaEvento(idEvento);


            return new ResponseEntity<>("Evento eliminato con successo.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Errore interno del server " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/cronologiaEventi")
    public ResponseEntity<List<Evento>> cronologiaEvento(@RequestParam Map<String, String> param, @RequestParam String token) {


        String email= util.extractEmail(token);

        if (email == null) {

            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        String stato = param.get("stato");
        List<Evento> listaEventi = gestioneEventoService.cronologiaEventi(email, stato);

        if (listaEventi == null || listaEventi.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return ResponseEntity.ok(listaEventi);

    }

    @GetMapping("/tuttiGliEventi")
    public ResponseEntity<List<Evento>> cronologiaEvento(){
        List<Evento> eventi = gestioneEventoService.tuttiGliEventi();
        if (eventi == null || eventi.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return ResponseEntity.ok(eventi);
    }


    public String salvaImmagine(String base64String) throws IOException {

        if (base64String == null) {
            return null;
        }
        String[] parts = base64String.split(",");
        String header = parts[0];
        String content = parts[1];

        String extension = ".jpg";
        if (header.contains("image/png")) {
            extension = ".png";
        } else if (header.contains("image/jpeg") || header.contains("image/jpg")) {
            extension = ".jpg";
        } else if (header.contains("image/gif")) {
            extension = ".gif";
        }

        byte[] imageBytes = Base64.getDecoder().decode(content);

        String fileName = UUID.randomUUID().toString() + extension;

        String UPLOAD_DIR = "uploads/stories/";
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(fileName);

        Files.write(filePath, imageBytes);


        return "/stories/" + fileName;


    }

}
