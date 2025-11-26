package it.lumen.business.gestionePartecipazioneEvento.control;

import it.lumen.business.gestioneAccount.service.GestioneAccountService;
import it.lumen.business.gestionePartecipazioneEvento.service.PartecipazioneEventoService;
import it.lumen.data.dao.PartecipazioneDAO;
import it.lumen.data.entity.Evento;
import it.lumen.data.entity.Partecipazione;
import it.lumen.data.entity.Utente;
import it.lumen.security.JwtUtil;

import java.util.ArrayList;
import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.BindingResult;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/partecipazione")
public class gestionePartecipazioneEventoControl {

	@Autowired
	private PartecipazioneEventoService partecipazioneEventoService;

	private JwtUtil util;

	@PostMapping("/aggiungi")
	public ResponseEntity<String> aggiungiPartecipazione(@RequestBody Partecipazione partecipazione, @RequestParam String token) {

		Evento evento = partecipazione.getEvento();
		Utente volontario = partecipazione.getVolontario();

		String ruolo = util.extractRuolo(token);
		String email = util.extractEmail(token);

		try {


			if (email == null) {

				return new ResponseEntity<>("Email dell'utente non può essere vuota", HttpStatus.BAD_REQUEST);
			}
			if (evento == null) {

				return new ResponseEntity<>("Evento non può essere vuoto", HttpStatus.BAD_REQUEST);
			}
			if (volontario == null) {

				return new ResponseEntity<>("Volontario non può essere vuoto", HttpStatus.BAD_REQUEST);
			}
			if(!ruolo.equals("volontario")){

				return new ResponseEntity<>("Utente deve essere volontario per partecipare", HttpStatus.BAD_REQUEST);
			}

			List<Partecipazione> listaPartecipazioniEvento = partecipazioneEventoService.listaPartecipazioni(evento.getIdEvento());

			if (listaPartecipazioniEvento.contains(volontario)) {

				return new ResponseEntity<>("Volontario gia' partecipa all'evento", HttpStatus.BAD_REQUEST);
			}

			if (listaPartecipazioniEvento.size() >= evento.getMaxPartecipanti()) {

				return new ResponseEntity<>("Numero di partecipanti al completo", HttpStatus.BAD_REQUEST);
			}

			partecipazione.setData(new Date(System.currentTimeMillis()));
			partecipazioneEventoService.aggiungiPartecipazione(partecipazione);
			return new ResponseEntity<>("Aggiunta partecipazione avvenuta con successo", HttpStatus.CREATED);

		} catch (Exception e) {

			return new ResponseEntity<>("Errore interno del server " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }

	@PostMapping("/modifica")
	public ResponseEntity<String> modificaPartecipazione(@RequestBody Partecipazione nuovaPartecipazione, @RequestParam String token) {

		Evento evento = nuovaPartecipazione.getEvento();
		Utente volontario = nuovaPartecipazione.getVolontario();

		String ruolo = util.extractRuolo(token);
		String email = util.extractEmail(token);

		try {

			if (email == null) {

				return new ResponseEntity<>("Email dell'utente non può essere vuota", HttpStatus.BAD_REQUEST);
			}
			if (evento == null) {

				return new ResponseEntity<>("Evento non può essere vuoto", HttpStatus.BAD_REQUEST);
			}
			if (volontario == null) {

				return new ResponseEntity<>("Volontario non può essere vuoto", HttpStatus.BAD_REQUEST);
			}
			if(!ruolo.equals("volontario")){

				return new ResponseEntity<>("Utente deve essere volontario per modificare la partecipazione", HttpStatus.BAD_REQUEST);
			}

			partecipazioneEventoService.modificaPartecipazione(nuovaPartecipazione);
			return new ResponseEntity<>("Modifica avvenuta con successo", HttpStatus.OK);


		}catch(Exception e ){

			return new ResponseEntity<>("Errore interno del server " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	@PostMapping("/rimuovi")
	public ResponseEntity<String> eliminaPartecipazione(@RequestBody Partecipazione partecipazione, @RequestParam String token){

		Evento evento = partecipazione.getEvento();
		Utente volontario = partecipazione.getVolontario();

		String ruolo = util.extractRuolo(token);
		String email = util.extractEmail(token);


		try{

			if (email == null) {

				return new ResponseEntity<>("Email dell'utente non può essere vuota", HttpStatus.BAD_REQUEST);
			}
			if (evento == null) {

				return new ResponseEntity<>("Evento non può essere vuoto", HttpStatus.BAD_REQUEST);
			}
			if (volontario == null) {

				return new ResponseEntity<>("Volontario non può essere vuoto", HttpStatus.BAD_REQUEST);
			}
			if(!ruolo.equals("volontario")){

				return new ResponseEntity<>("Utente deve essere volontario per eliminare la partecipazione", HttpStatus.BAD_REQUEST);
			}

			partecipazioneEventoService.eliminaPartecipazione(partecipazione.getIdPartecipazione());
			return new ResponseEntity<>("Eliminazione partecipazione avvenuta con successo", HttpStatus.OK);

		}catch(Exception e){

			return new ResponseEntity<>("Errore interno del server " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	@PostMapping("/visualizzaPartecipazioniEvento")
	public ResponseEntity<List<Partecipazione>> visualizzaPartecipazioniEvento(@RequestBody Evento evento, @RequestParam String token){

		String email = util.extractEmail(token);

		if (email == null) {

			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}

		List<Partecipazione> lista = partecipazioneEventoService.listaPartecipazioni(evento.getIdEvento());

		return ResponseEntity.ok(lista);
	}
}
