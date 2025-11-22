package it.lumen.data.dto;

import it.lumen.data.entity.RichiestaServizio;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.sql.Date;


@Data
public class RichiestaServizioDTO {

    @NotNull(message = "Va specificato un ID")
    private Integer idRichiestaServizio;

    @NotBlank(message = "Il messaggio della richiesta è obbligatorio")
    private String testo;

    @NotBlank(message = "Deve essere specificata la data di creazione della richiesta")
    //@FutureOrPresent(message = "La data di creazione della richiesta non può essere nel passato")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date dataRichiesta;

    @NotBlank(message = "Lo stato della richiesta è obbligatorio")
    private RichiestaServizio.StatoRichiestaServizio stato;

    @Email(message = "Email del beneficiario non valida")
    private String email;

    @Email(message = "Email del destinatario non valida")
    private String enteVolontario;
}
