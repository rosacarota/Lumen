package it.lumen.business.gestioneRegistrazione.control;

import it.lumen.business.gestioneRegistrazione.service.RegistrazioneService;
import it.lumen.data.entity.Utente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.BindingResult;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/registrazione")
public class RegistrazioneControl {

    private final RegistrazioneService registrazioneService;

    @Autowired
    public RegistrazioneControl(RegistrazioneService registrazioneService) {
        this.registrazioneService = registrazioneService;
    }

    @GetMapping
    @PostMapping
    public ResponseEntity<String> registraUtente(@Valid @RequestBody Utente utente, BindingResult result) {
        if (result.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder("Errori di validazione:");
            result.getAllErrors().forEach(e -> errorMsg.append(" ").append(e.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorMsg.toString());
        }

        registrazioneService.RegistraUtente(utente);

        return ResponseEntity.ok("Utente registrato con successo");
    }
}
