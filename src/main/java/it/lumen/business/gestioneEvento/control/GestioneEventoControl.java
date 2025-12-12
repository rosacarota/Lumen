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

/**
 * Controller REST per la gestione delle operazioni relative agli Eventi,
 * come l'aggiunta, modifica, eliminazione e visualizzazione di tutti gli eventi dell'Ente o solo parte degli eventi tramite filtro.
 */
@RestController
@RequestMapping("/evento")
public class GestioneEventoControl {


    private final GestioneEventoService gestioneEventoService;
    private final JwtUtil util;
    private final AutenticazioneService autenticazioneService;
    /**
     * Costruttore per l'iniezione delle dipendenze.
     * @param gestioneEventoService Servizio per la gestione degli Eventi.
     * @param util Utility per la gestione dei JWT.
     * @param autenticazioneService Servizio per la gestione dell'autenticazione.
     */
    public GestioneEventoControl(GestioneEventoService gestioneEventoService, JwtUtil util, AutenticazioneService autenticazioneService) {
        this.gestioneEventoService = gestioneEventoService;
        this.util = util;
        this.autenticazioneService = autenticazioneService;
    }


    /**
     * Pubblicazione dell'evento di un Ente autenticato tramite token.
     * @param evento Oggetto Evento contenente i dati dell'Evento.
     * @param token Il token JWT dell'Ente per verificarne l'identità.
     * @return Una ResponseEntity contenente l'oggetto Evento
     *         (inclusa l'immagine in base64).
     */
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
        }
        catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);

        }
        catch (Exception e) {

            return new ResponseEntity<>("Errore interno del server " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Modifica di un Evento di un Ente autenticato tramite token.
     * @param nuovoEvento Oggetto Evento con i nuovi dati.
     * @param token Il token JWT dell'Ente per verificarne l'identità.
     * @return Una ResponseEntity contenente l'oggetto Evento modificato
     *         (inclusa l'immagine in base64).
     */
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


    /**
     * Eliminazione di un Evento di un Ente autenticato tramite token.
     * @param body Mappa contenente l'identificativo dell'oggetto Evento da eliminare.
     * @param token Il token JWT dell'Ente per verificarne l'identità.
     * @return Una ResponseEntity contenente l'esito dell'operazione.
     */
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

    /**
     * Visualizzazione degli Eventi di un Ente autenticato tramite token.
     * @param param Mappa contenente l'email dell'Ente che ha pubblicato l'evento.
     * @param token Il token JWT dell'Ente per verificarne l'identità.
     * @return Una ResponseEntity contenente la lista degli Eventi dell'Ente.
     */
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

        for (Evento evento : listaEventi) {
            try {
                evento.setImmagine(gestioneEventoService.recuperaImmagine(evento.getImmagine()));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        return ResponseEntity.ok(listaEventi);
    }


    /**
     * Visualizzazione degli Eventi di un Ente autenticato tramite email.
     * @param param Mappa contenente l'email dell'Ente che ha pubblicato l'evento.
     * @param email L'email associata all'Ente
     * @return Una ResponseEntity contenente la lista degli Eventi dell'Ente.
     */
    @GetMapping("/cronologiaEventiEnteEsterno")
    public ResponseEntity<List<Evento>> cronologiaEventiEsterni(@RequestParam Map<String, String> param, @RequestParam String email) {

        if (email == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        String stato = param.get("stato");
        List<Evento> listaEventi = gestioneEventoService.cronologiaEventi(email, stato);


        if (listaEventi == null || listaEventi.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        for (Evento evento : listaEventi) {
            try {
                evento.setImmagine(gestioneEventoService.recuperaImmagine(evento.getImmagine()));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        return ResponseEntity.ok(listaEventi);
    }

    /**
     * Visualizzazione da parte di un Utente di tutti gli Eventi.
     * @return Una ResponseEntity contenente la lista di tutti gli Eventi degli Enti
     */
    @GetMapping("/tuttiGliEventi")
    public ResponseEntity<List<Evento>> cronologiaEvento(){
        List<Evento> eventi = gestioneEventoService.tuttiGliEventi();
        if (eventi == null || eventi.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        for (Evento evento : eventi) {
            try {
                evento.setImmagine(gestioneEventoService.recuperaImmagine(evento.getImmagine()));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        return ResponseEntity.ok(eventi);
    }



    /**
     * Decodifica una stringa in formato Base64, la converte in un file immagine e la salva
     * @param base64String La stringa che rappresenta l'immagine in formato Base64.
     * @return Il percorso relativo (URL-friendly) dell'immagine salvata.
     * @throws IOException Se si verificano errori durante la scrittura del file.
     */
    public String salvaImmagine(String base64String) throws IOException {

        if (base64String == null || base64String.trim().isEmpty()) {
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
        else {
            throw new IllegalArgumentException("Formato file non supportato. Sono ammesse solo immagini (PNG, JPEG, GIF).");
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
