package it.lumen.data.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RaccoltaFondiDTO {

    @NotNull(message = "Un id è obbligatorio")
    private Integer idRaccoltaFondi;

    @NotBlank(message = "Un titolo è obbligatorio")
    @Size(max = 255)
    private String titolo;

    private String descrizione;

    @NotNull(message = "Un obiettivo è obbligatorio")
    @Positive(message = "L'obiettivo deve essere maggiore di zero")
    @Digits(integer = 8, fraction = 2, message = "Formato dell'obiettivo non valido")
    private BigDecimal obiettivo;

    @Digits(integer = 8, fraction = 2, message = "Formato del totale raccolto non valido")
    private BigDecimal totaleRaccolto;

    @NotNull(message = "La data di apertura è obbligatoria")
    @FutureOrPresent(message = "La data di apertura non può essere nel passato")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date dataApertura;

    @NotNull(message = "La data di chiusura è obbligatoria")
    @Future(message = "La data di chiusura deve essere nel futuro")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date dataChiusura;

    @NotBlank(message = "L'email di un ente è obbligatoria")
    @Email(message = "Email dell'ente non valida")
    private String ente;
}
