package it.lumen.business.raccoltaFondi.control;

import it.lumen.business.raccoltaFondi.service.RaccoltaFondiService;
import it.lumen.data.entity.RaccoltaFondi;
import it.lumen.data.entity.Utente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

import javax.validation.Valid;

@RestController
@RequestMapping("/raccoltaFondi")
public class RaccoltaFondiControl{

    private final RaccoltaFondiService raccoltaFondiService;

    @Autowired
    public RaccoltaFondiControl(RaccoltaFondiService raccoltaFondiService) {this.raccoltaFondiService = raccoltaFondiService;}

    //AVVIO RACCOLTA FONDI
    @PostMapping("/avviaRaccoltaFondi")
    public ResponseEntity<String> avvioRaccoltaFondi(@Valid @RequestBody RaccoltaFondi raccoltaFondi, BindingResult result){
        if (result.hasErrors()){
            StringBuilder errorMsg = new StringBuilder("Errori di validazione: ");
            result.getAllErrors().forEach(error -> errorMsg.append(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorMsg.toString());
        }
        raccoltaFondiService.avviaRaccoltaFondi(raccoltaFondi);
        return ResponseEntity.ok("Raccolta fondi avviata " + raccoltaFondi.getTitolo() + " con successo");
    }

    //TERMINA RACCOLTA FONDI
    @PostMapping("/terminaRaccoltaFondi")
    public ResponseEntity<String> terminaRaccoltaFondi(@Valid @RequestBody RaccoltaFondi raccoltaFondi, BindingResult result) {
        if(result.hasErrors()){
            StringBuilder errorMsg = new StringBuilder("Errori di validazione: ");
            result.getAllErrors().forEach(error -> errorMsg.append(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorMsg.toString());
        }
        raccoltaFondiService.terminaRaccoltaFondi(raccoltaFondi);
        return ResponseEntity.ok("Raccolta fondi " + raccoltaFondi.getTitolo() + " terminata con successo");
    }

    //OTTIENI RACCOLTA FONDI
    @GetMapping("/ottieniRaccolteDiEnte")
    public ResponseEntity<String> ottieniRaccolteDiEnte(@Valid @RequestBody Utente utente, BindingResult result){
        if (result.hasErrors()){
            StringBuilder errorMsg = new StringBuilder("Errori di validazione: ");
            result.getAllErrors().forEach(error -> errorMsg.append(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorMsg.toString());
        }
        raccoltaFondiService.ottieniRaccolteDiEnte(utente);
        return ResponseEntity.ok("Raccolte fondi dell'ente " +  utente.getNome() + " ottenute con successo");
    }
}
