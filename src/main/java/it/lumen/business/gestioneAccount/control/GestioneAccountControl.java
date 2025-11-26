package it.lumen.business.gestioneAccount.control;

import it.lumen.business.gestioneAccount.service.GestioneAccountService;
import it.lumen.business.gestioneRegistrazione.service.RegistrazioneService;
import it.lumen.data.dto.SessionUser;
import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.data.dto.UtenteDTO;
import it.lumen.data.entity.Utente;
import it.lumen.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;


@RestController
@RequestMapping("/account")
public class GestioneAccountControl {
    private final AutenticazioneService autenticazioneService;
    private final JwtUtil jwtUtil;
    private final GestioneAccountService gestioneAccountService;
    private final RegistrazioneService registrazioneService;

    @Autowired
    public GestioneAccountControl(AutenticazioneService autenticazioneService, JwtUtil jwtUtil, GestioneAccountService  gestioneAccountService,  RegistrazioneService registrazioneService) {
        this.autenticazioneService = autenticazioneService;
        this.jwtUtil = jwtUtil;
        this.gestioneAccountService= gestioneAccountService;
        this.registrazioneService = registrazioneService;
    }

    @PostMapping("/datiUtente")
    public ResponseEntity<?> datiUtente(@RequestBody SessionUser sessionUser) {

        String token= sessionUser.getToken();
        String email = jwtUtil.extractEmail(token);

        Utente utente = autenticazioneService.getUtente(email);

        return  ResponseEntity.status(HttpStatus.OK).body(utente);
    }


    public ResponseEntity<?> modificaUtente(@RequestBody UtenteDTO utenteDTO, @RequestParam String token) {
        String email = jwtUtil.extractEmail(token);

        if (!email.equals(utenteDTO.getEmail())) {
            return new ResponseEntity<>("Puoi modificare solo il tuo account", HttpStatus.BAD_REQUEST);
        }

        Utente utente = autenticazioneService.getUtente(email);

        if(utenteDTO.getNome()!=null){
            utente.setNome(utenteDTO.getNome());
        }

        utente.setCognome(utenteDTO.getCognome());

        utente.setDescrizione(utenteDTO.getDescrizione());

        utente.setEmail(utenteDTO.getRecapitoTelefonico());

        if (utente.getImmagine() != null && !utente.getImmagine().isEmpty()) {
            try {
                String pathImmagineSalvata = registrazioneService.salvaImmagine(utenteDTO.getImmagine());

                utente.setImmagine(pathImmagineSalvata);

            } catch (IOException e) {
                throw new RuntimeException("Errore durante il salvataggio dell'immagine: " + e.getMessage());
            }
        }


        gestioneAccountService.modificaUtente(utente);

        return new ResponseEntity<>("Puoi modificare solo il tuo account", HttpStatus.OK);

    }
}
