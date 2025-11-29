package it.lumen.business.gestioneRicercaUtente.control;


import it.lumen.business.gestioneRicercaUtente.service.RicercaUtenteService;
import it.lumen.data.dao.UtenteDAO;
import it.lumen.data.entity.Utente;
import it.lumen.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ricercaUtente")
public class RicercaUtenteControl {


    private final RicercaUtenteService ricercaUtenteService;
    private final JwtUtil jwtUtil;

    @Autowired
    public RicercaUtenteControl(RicercaUtenteService ricercaUtenteService, JwtUtil jwtUtil) {
        this.ricercaUtenteService = ricercaUtenteService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/cerca")
    public ResponseEntity<List<Utente>> ricercaUtente(@RequestParam String nome) {

        if(nome ==  null || nome.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        List<Utente> listaUtenti = ricercaUtenteService.getUtentiPerNome(nome);
        System.out.println(listaUtenti.toString());
        return ResponseEntity.ok(listaUtenti);
    }
}
