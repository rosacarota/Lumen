package it.lumen.business.richiestaServizio.control;

import it.lumen.business.richiestaServizio.service.RichiestaServizioService;
import it.lumen.data.entity.RichiestaServizio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
@RestController
@RequestMapping("/richiestaServizio")
public class RichiestaServizioControl {

    @Autowired
    private final RichiestaServizioService richiestaServizioService;

    @Autowired
    public RichiestaServizioControl(RichiestaServizioService richiestaServizioService) {this.richiestaServizioService = richiestaServizioService;}

    //CREA RICHIESTA DI SERVIZIO
    @PostMapping("/creaRichiestaServizio")
    public ResponseEntity<String> creaRichiestaServizio(@Valid @RequestBody RichiestaServizio richiestaServizio, BindingResult result) {
        if (result.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder("Errori di validazione: ");
            result.getAllErrors().forEach(error -> errorMsg.append(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorMsg.toString());
        }
        richiestaServizioService.creaRichiestaServizio(richiestaServizio);
        return ResponseEntity.ok("Richiesta servizio creato");
    }

    //ACCETTA RICHIESTA DI SERVIZIO
    @PostMapping("/accettaRichiestaServizio")
    public ResponseEntity<String> accettaRichiestaServizio(@Valid @RequestBody RichiestaServizio richiestaServizio, BindingResult result) {
        if (result.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder("Errori di validazione: ");
            result.getAllErrors().forEach(error -> errorMsg.append(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorMsg.toString());
        }
        richiestaServizioService.accettaRichiestaServizio(richiestaServizio);
        return ResponseEntity.ok("Richiesta servizio accettata con successo");
    }

    //RIFIUTA RICHIESTA SERVIZIO
    @PostMapping("/rifiutaRichiestaServizio")
    public ResponseEntity<String> rifiutaRichiestaServizio(@Valid @RequestBody RichiestaServizio richiestaServizio, BindingResult result) {
        if (result.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder("Errori di validazione: ");
            result.getAllErrors().forEach(error -> errorMsg.append(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorMsg.toString());
        }
        richiestaServizioService.rifiutaRichiestaServizio(richiestaServizio);
        return ResponseEntity.ok("Richiesta servizio rifiutata con successo");
    }
}
