package it.lumen.business.gestioneRegistrazione.control;

import it.lumen.business.gestioneRegistrazione.service.RegistrazioneService;
import it.lumen.data.entity.Utente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.BindingResult;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/registrazione")
public class RegistrazioneControl {

    private final RegistrazioneService registrazioneService;

    @Autowired
    public RegistrazioneControl(RegistrazioneService registrazioneService) {
        this.registrazioneService = registrazioneService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> registraUtente(@Valid @RequestBody Utente utente, BindingResult result) {

        Map<String, String> responseBody = new HashMap<>();

        if (result.hasErrors()) {
            String detailedErrorMsg = result.getAllErrors().stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .collect(Collectors.joining("; "));

            responseBody.put("message", "Errori di validazione: " + detailedErrorMsg);

            return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
        }

        try {
            registrazioneService.registraUtente(utente);

            responseBody.put("message", "Utente registrato con successo");

            return ResponseEntity.ok(responseBody);

        } catch (IllegalArgumentException ex) {

            responseBody.put("message", ex.getMessage());

            return ResponseEntity.status(HttpStatus.CONFLICT).body(responseBody);
        }
    }
}