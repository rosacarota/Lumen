package it.lumen.data.dto;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Date;

@Data
@NoArgsConstructor
public class DonazioneDTO {
    @NotNull(message = "Un id è obbligatorio")
    private Integer IDDonazione;

    @NotBlank(message = "L'email dell'utente è obbligatoria")
    @Email(message = "Formato email dell'ente non valido")
    private String ente;

    @NotBlank(message = "L'id della raccolta fondi è obbligatorio")
    private Integer raccoltaFondi;

    @NotNull(message = "Deve essere inserito un importo")
    private BigDecimal importo;

    @NotNull(message = "Deve essere specificata la data in cui è avvenuta la donazione")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date dataDonazione;
}
