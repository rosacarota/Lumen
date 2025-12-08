package it.lumen.business.gestioneRaccoltaFondi.control;

import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.business.gestioneRaccoltaFondi.service.RaccoltaFondiService;
import it.lumen.data.entity.RaccoltaFondi;
import it.lumen.data.entity.Utente;
import it.lumen.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/raccoltaFondi")
@CrossOrigin(origins = "http://localhost:5173") // Abilita le chiamate dal Frontend
public class RaccoltaFondiControl {

    private final RaccoltaFondiService raccoltaFondiService;
    private final JwtUtil jwtUtil;
    private final AutenticazioneService autenticazioneService;

    @Autowired
    public RaccoltaFondiControl(RaccoltaFondiService raccoltaFondiService, JwtUtil jwtUtil, AutenticazioneService autenticazioneService) {
        this.raccoltaFondiService = raccoltaFondiService;
        this.jwtUtil = jwtUtil;
        this.autenticazioneService = autenticazioneService;
    }

    @PostMapping("/avviaRaccoltaFondi")
    public ResponseEntity<String> avvioRaccoltaFondi(
            @RequestBody RaccoltaFondi raccoltaFondi,
            BindingResult result,
            @RequestParam String token) {

        System.out.println("--- INIZIO AVVIO RACCOLTA ---");
        System.out.println("Token ricevuto: " + token);

        if (result.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder("Errori validazione: ");
            result.getAllErrors().forEach(error -> errorMsg.append(error.getDefaultMessage()).append("; "));
            System.out.println("Errore: " + errorMsg);
            return ResponseEntity.badRequest().body(errorMsg.toString());
        }

        raccoltaFondi.setDataApertura(Date.valueOf(LocalDate.now()));

        if(raccoltaFondi.getDataChiusura().toLocalDate().isBefore(raccoltaFondi.getDataApertura().toLocalDate())){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La data di avvio deve precedere la data di fine");
        }

        String email = null;
        try {
            email = jwtUtil.extractEmail(token);
            System.out.println("Email estratta dal token: " + email);
        } catch (Exception e) {
            System.out.println("Errore estrazione token (scaduto o formato errato): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token non valido o scaduto");
        }

        if (email == null) {
            System.out.println("Errore: Email null nel token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token non valido");
        }

        Utente utente = autenticazioneService.getUtente(email);
        raccoltaFondi.setEnte(utente);
        if (utente == null) {
            System.out.println("Errore: Utente non trovato nel DB con email " + email);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utente non trovato");
        }

        System.out.println("Utente trovato: " + utente.getEmail() + " - Ruolo: " + utente.getRuolo());

        if (utente.getRuolo() != Utente.Ruolo.Ente) {
            System.out.println("Errore: L'utente non ha il ruolo Ente");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo gli Enti possono avviare raccolte fondi");
        }


        raccoltaFondiService.avviaRaccoltaFondi(raccoltaFondi);
        System.out.println("Successo: Raccolta avviata");
        return ResponseEntity.ok("Raccolta fondi " + raccoltaFondi.getTitolo() + " avviata con successo");
    }

    @GetMapping("/terminaRaccoltaFondi")
    public ResponseEntity<String> terminaRaccoltaFondi(@RequestParam int idRaccolta, @RequestParam String token) {

        String email = jwtUtil.extractEmail(token);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token non valido");

        Utente utente = autenticazioneService.getUtente(email);
        if (utente == null || utente.getRuolo() != Utente.Ruolo.Ente) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Non autorizzato");
        }

        raccoltaFondiService.terminaRaccoltaFondi(idRaccolta);
        return ResponseEntity.ok("Raccolta terminata");
    }


    @GetMapping("/ottieniRaccolteDiEnte")
    public ResponseEntity<?> ottieniRaccolteDiEnte(@RequestParam String token) {
        String email = jwtUtil.extractEmail(token);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token non valido");

        Utente utente = autenticazioneService.getUtente(email);
        if (utente == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utente non trovato");

        return ResponseEntity.ok(raccoltaFondiService.ottieniRaccolteDiEnte(utente));
    }
}