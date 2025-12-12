package it.lumen.data.dto;

import java.sql.Date;

import it.lumen.data.entity.Indirizzo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) che rappresenta un evento.
 * Include dettagli come titolo, descrizione, luogo, date di inizio e fine,
 * l'organizzatore, il numero massimo di partecipanti e l'immagine.
 */
@Data
@NoArgsConstructor
public class EventoDTO {

	/** Identificativo univoco dell'evento. */
	@NotNull(message = "Un id è obbligatorio")
	private Integer idEvento;

	/** Titolo dell'evento. */
	@NotBlank(message = "Titolo obbligatorio")
	@Size(max = 255)
	private String titolo;

	/** Descrizione dell'evento. */
	@NotBlank(message = "Descrizione obbligatoria")
	private String descrizione;

	/** Indirizzo di svolgimento dell'evento. */
	@NotNull(message = "Luogo obbligatorio")
	private Indirizzo indirizzo;

	/** Data di inizio dell'evento. */
	@NotNull(message = "Data inizio obbligatoria")
	private Date dataInizio;

	/** Data di fine dell'evento. */
	@NotNull(message = "Data fine obbligatoria")
	private Date dataFine;

	/** Email dell'utente organizzatore o responsabile (es. ente o volontario). */
	@NotBlank(message = "L'email dell'utente è obbligatoria")
	@Email(message = "L'email è in un formato non valido")
	private String utente;

	/** Numero massimo di partecipanti consentiti. */
	private int maxPartecipanti;

	/** URL o percorso dell'immagine locandina dell'evento. */
	@Size(max = 255)
	private String immagine;

}
