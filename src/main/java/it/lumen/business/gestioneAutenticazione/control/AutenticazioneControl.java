package it.lumen.business.gestioneAutenticazione.control;

import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.business.gestioneRegistrazione.service.RegistrazioneService;
import it.lumen.data.entity.Utente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.BindingResult;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/login")


public class AutenticazioneControl {

    private final AutenticazioneService autenticazioneService;

    @Autowired
    public AutenticazioneControl(RegistrazioneService registrazioneService) {
        this.autenticazioneService = (AutenticazioneService) registrazioneService;
    }

    @PostMapping
    public ResponseEntity<String> login(String email,String password, BindingResult result) {
        if (result.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder("Errori di validazione:");
            result.getAllErrors().forEach(e -> errorMsg.append(" ").append(e.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorMsg.toString());
        }

        Utente utente = autenticazioneService.login(email, password);
        if (utente == null) {
            return new ResponseEntity<>("Utente non trovato", HttpStatus.UNAUTHORIZED);
        }
        return ResponseEntity.ok("Accesso con successo");
    }
}
