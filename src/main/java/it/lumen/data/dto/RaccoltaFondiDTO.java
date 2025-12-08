package it.lumen.data.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Date;

/**
 * Data Transfer Object (DTO) per la gestione di una raccolta fondi.
 * Contiene i dettagli sulla raccolta, come titolo, descrizione, obiettivo
 * economico, stato della raccolta e date di validità.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RaccoltaFondiDTO {

    /** Identificativo univoco della raccolta fondi. */
    @NotNull(message = "Un id è obbligatorio")
    private Integer idRaccoltaFondi;

    /** Titolo della raccolta fondi. */
    @NotBlank(message = "Un titolo è obbligatorio")
    @Size(max = 255)
    private String titolo;

    /** Descrizione dettagliata della causa e della raccolta fondi. */
    private String descrizione;

    /** Obiettivo monetario da raggiungere. */
    @NotNull(message = "Un obiettivo è obbligatorio")
    @Positive(message = "L'obiettivo deve essere maggiore di zero")
    @Digits(integer = 8, fraction = 2, message = "Formato dell'obiettivo non valido")
    private BigDecimal obiettivo;

    /** Totale attualmente raccolto. */
    @Digits(integer = 8, fraction = 2, message = "Formato del totale raccolto non valido")
    private BigDecimal totaleRaccolto;

    /** Data di inizio della raccolta fondi. */
    @NotNull(message = "La data di apertura è obbligatoria")
    @FutureOrPresent(message = "La data di apertura non può essere nel passato")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date dataApertura;

    /** Data di chiusura prevista per la raccolta fondi. */
    @NotNull(message = "La data di chiusura è obbligatoria")
    @Future(message = "La data di chiusura deve essere nel futuro")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date dataChiusura;

    /** Email dell'ente promotore della raccolta fondi. */
    @NotBlank(message = "L'email di un ente è obbligatoria")
    @Email(message = "Email dell'ente non valida")
    private String ente;
}
