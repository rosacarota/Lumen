package it.lumen.data.dto;

import it.lumen.data.entity.RaccoltaFondi;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Date;

@Data
@NoArgsConstructor
public class RaccoltaFondiDTO {

    @NotBlank(message = "Un id è obbligatorio")
    private Integer idRaccoltaFondi;

    @NotBlank(message = "È necessario un titolo per la raccolta fondi")
    @Size(max = 255)
    private String titolo;

    @NotBlank(message = "È necessario definire un obiettivo")
    @Positive(message = "L'obiettivo deve essere maggiore di zero")
    @Digits(integer = 8, fraction = 2, message = "Formato non valido")
    private BigDecimal obiettivo;

    @Digits(integer = 8, fraction = 2, message = "Formato non valido")
    private BigDecimal totaleRaccolto;

    @NotBlank(message = "La data di apertura è obbligatoria")
    @FutureOrPresent(message = "La data di apertura non può essere nel passato")
    @JsonFormat(pattern = "dd-MM-yyy")
    private Date dataApertura;

    @NotNull(message = "La data di chiusura è obbligatoria")
    @Future(message = "La data di chiusura deve essere nel futuro")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date dataChiusura;

    @Email(message = "Email dell'ente non valida")
    @NotBlank(message = "Specificare l'Ente")
    private String ente;
}
