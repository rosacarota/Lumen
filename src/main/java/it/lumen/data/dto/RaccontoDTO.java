package it.lumen.data.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Date;

@Data
@NoArgsConstructor
public class RaccontoDTO {

    @NotBlank(message = "Un id è obbligatorio")
    private Integer idRacconto;

    @NotBlank(message = "il titolo è obbligatorio")
    @Size(max= 255, message="Il titolo non può superare i 255 caratteri")
    private String titolo;

    private String descrizione;

    @NotNull(message = "La data di pubblicazione è obbligatioria")
    @Future(message = "La data non può essere futura")
    private Date dataPubblicazione;

    @Size(max=255, message = "Il percorso dell'immagine è troppo lungo")
    private String immagine;

    @NotBlank(message = "L'email dell'utente è obbligatoria")
    @Email(message = "L'email è in un formato non valido")
    String emailUtente;
}
