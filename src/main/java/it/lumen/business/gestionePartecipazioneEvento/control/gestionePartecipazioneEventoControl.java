package it.lumen.business.gestionePartecipazioneEvento.control;

import it.lumen.business.gestioneAccount.service.GestioneAccountService;
import it.lumen.business.gestionePartecipazioneEvento.service.PartecipazioneEventoService;
import it.lumen.data.entity.Evento;
import it.lumen.data.entity.Partecipazione;
import it.lumen.data.entity.Utente;

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


	@PostMapping("/aggiungi")
	public ResponseEntity<String> aggiungiPartecipazione(@RequestBody Partecipazione partecipazione) {

		Evento evento = partecipazione.getEvento();
		Utente volontario = partecipazione.getVolontario();

		try {

			if (evento == null) {

				return new ResponseEntity<>("Evento non può essere vuoto", HttpStatus.BAD_REQUEST);
			}
			if (volontario == null) {

				return new ResponseEntity<>("Volontario non può essere vuoto", HttpStatus.BAD_REQUEST);
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

		} catch (Exception e) {

			return new ResponseEntity<>("Errore interno del server " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return null;
	}
}
	// TODO: modifica and rimuovi

