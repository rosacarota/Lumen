package it.lumen.data.dto;

import java.sql.Date;

import it.lumen.data.entity.Indirizzo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EventoDTO {


	@NotBlank(message = "Titolo obbligatorio")
	@Size(max = 255)
	private String titolo;

	@NotBlank(message = "Descrizione obbligatoria")
	private String descrizione;

	@NotBlank(message = "Luogo obbligatorio")
	private Indirizzo indirizzo;

	@NotBlank(message = "Data inizio obbligatoria")
	private Date dataInizio;

	@NotBlank(message = "Data fine obbligatoria")
    private Date dataFine;

    @NotBlank(message = "L'email dell'utente è obbligatoria")
    @Email(message = "L'email è in un formato non valido")
    String emailEnte;

    private int maxPartecipanti;

	@Size(max = 255)
    private String immagine;

}
