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

    private String testo;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date dataRichiesta;

    private RichiestaServizio.StatoRichiestaServizio stato;

    @Email(message = "Email del beneficiario non valida")
    private String beneficiario;

    @Email(message = "Email del destinatario non valida")
    private String enteVolontario;
}
