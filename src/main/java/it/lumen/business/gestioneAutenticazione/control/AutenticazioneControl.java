package it.lumen.business.gestioneAutenticazione.control;

import it.lumen.data.dto.SessionUser;
import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.data.entity.Utente;
import it.lumen.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller REST per la gestione dell'autenticazione utente.
 * Espone l'endpoint per il login.
 */
@RestController
@RequestMapping("/login")
public class AutenticazioneControl {
    private final AutenticazioneService autenticazioneService;
    private final JwtUtil jwtUtil;

    /**
     * Costruttore per l'iniezione delle dipendenze.
     *
     * @param autenticazioneService Servizio di autenticazione.
     * @param jwtUtil               Utility per la gestione dei token JWT.
     */
    @Autowired
    public AutenticazioneControl(AutenticazioneService autenticazioneService, JwtUtil jwtUtil) {
        this.autenticazioneService = autenticazioneService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Gestisce la richiesta di login.
     *
     * @param credentials Mappa contenente "email" e "password".
     * @return Una ResponseEntity contenente un oggetto {@link SessionUser} con il
     *         token JWT se il login ha successo,
     *         o un messaggio di errore se le credenziali non sono valide.
     */
    @PostMapping
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        if (email != null)
            email = email.trim();
        String password = credentials.get("password");

        Utente utente = autenticazioneService.login(email, password);

        if (utente == null) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Credenziali non valide");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }

        String token = jwtUtil.generateToken(utente.getEmail(), utente.getRuolo().toString());

        SessionUser sessionUser = new SessionUser(token, utente.getRuolo().toString());

        return ResponseEntity.ok(sessionUser);
    }
}
