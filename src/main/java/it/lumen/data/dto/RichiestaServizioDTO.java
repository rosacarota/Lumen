package it.lumen.data.dto;

import it.lumen.data.entity.RichiestaServizio;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RichiestaServizioDTO {

    private Integer idRichiestaServizio;

    @NotBlank(message = "Il messaggio della richiesta è obbligatorio")
    private String testo;

    @NotNull(message = "La data della creazione della richiesta è obbligatoria")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date dataRichiesta;

    private RichiestaServizio.StatoRichiestaServizio stato;

    @NotBlank(message = "L'email del beneficiario è obbligatoria")
    @Email(message = "Email del beneficiario non valida")
    private String beneficiario;

    @NotBlank(message = "L'email del destinatario è obbligatoria")
    @Email(message = "Email del destinatario non valida")
    private String enteVolontario;
}
