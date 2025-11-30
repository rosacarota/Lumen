package it.lumen.data.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import it.lumen.data.entity.Affiliazione.StatoAffiliazione;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Date;

@Data
@NoArgsConstructor
public class AffiliazioneDTO {

    @NotNull(message = "Un id è obbligatorio")
    private Integer idAffiliazione;

    private String descrizione;

    @NotNull(message = "La data di inizio è obbligatoria")
    //@Future(message = "La data di inizio non può essere nel futuro")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date dataInizio;

    @NotNull(message = "Lo stato dell'affiliazione è obbligatorio")
    private StatoAffiliazione stato;

    @NotBlank(message = "L'email dell'ente è obbligatoria")
    @Email(message = "Formato email dell'ente non valido")
    private String ente;

    @NotBlank(message = "L'email del volontario è obbligatoria")
    @Email(message = "Formato email del volontario non valido")
    private String volontario;
}