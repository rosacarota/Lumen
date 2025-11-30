package it.lumen.data.dto;

import java.sql.Date;

import it.lumen.data.entity.Indirizzo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EventoDTO {


    @NotNull(message = "Un id è obbligatorio")
    private Integer idEvento;

	@NotBlank(message = "Titolo obbligatorio")
	@Size(max = 255)
	private String titolo;

	@NotBlank(message = "Descrizione obbligatoria")
	private String descrizione;

	@NotNull(message = "Luogo obbligatorio")
	private Indirizzo indirizzo;

	@NotNull(message = "Data inizio obbligatoria")
	private Date dataInizio;

	@NotNull(message = "Data fine obbligatoria")
    private Date dataFine;

    @NotBlank(message = "L'email dell'utente è obbligatoria")
    @Email(message = "L'email è in un formato non valido")
    private String utente;

    private int maxPartecipanti;

	@Size(max = 255)
    private String immagine;

}
