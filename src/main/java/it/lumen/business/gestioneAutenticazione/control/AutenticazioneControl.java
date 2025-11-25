package it.lumen.business.gestioneAutenticazione.control;

import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.data.dto.UtenteDTO;
import it.lumen.data.entity.Utente;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.BindingResult;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/login")
public class AutenticazioneControl {

    private final AutenticazioneService autenticazioneService;

    @Autowired
    public AutenticazioneControl(AutenticazioneService autenticazioneService) {
        this.autenticazioneService = autenticazioneService;
    }

    @PostMapping
    public ResponseEntity<String> login(@Valid @RequestBody UtenteDTO utenteDTO, BindingResult result, HttpSession session) {
        if (result.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder("Errori di validazione:");
            result.getAllErrors().forEach(e -> errorMsg.append(" ").append(e.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorMsg.toString());
        }

        if (utenteDTO.getEmail() == null || utenteDTO.getPassword() == null) {
            return ResponseEntity.badRequest().body("Email e password sono obbligatorie!");
        }

        Utente utente = autenticazioneService.login(utenteDTO.getEmail(), utenteDTO.getPassword());
        if (utente == null) {
            return new ResponseEntity<>("Utente non trovato", HttpStatus.UNAUTHORIZED);
        }

        session.setAttribute("utente", utente);

        String token = (String) session.getAttribute("token");

        System.out.println(token);

        return ResponseEntity.ok("Accesso con successo");
    }
}
