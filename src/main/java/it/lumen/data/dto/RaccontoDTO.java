package it.lumen.data.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Date;

/**
 * Data Transfer Object (DTO) che rappresenta un racconto o testimonianza.
 * Include titolo, testo, data di pubblicazione, eventuale immagine e l'autore.
 */
@Data
@NoArgsConstructor
public class RaccontoDTO {

    /** Identificativo univoco del racconto. */
    @NotNull(message = "Un id è obbligatorio")
    private Integer idRacconto;

    /** Titolo del racconto. */
    @NotBlank(message = "il titolo è obbligatorio")
    @Size(max = 255, message = "Il titolo non può superare i 255 caratteri")
    private String titolo;

    /** Testo o descrizione del racconto. */
    private String descrizione;

    /** Data di pubblicazione del racconto. */
    @NotNull(message = "La data di pubblicazione è obbligatioria")
    @Future(message = "La data non può essere futura")
    private Date dataPubblicazione;

    /** URL o percorso dell'immagine associata al racconto. */
    @Size(max = 255, message = "Il percorso dell'immagine è troppo lungo")
    private String immagine;

    /** Email dell'utente autore del racconto. */
    @NotBlank(message = "L'email dell'utente è obbligatoria")
    @Email(message = "L'email è in un formato non valido")
    String emailUtente;
}
