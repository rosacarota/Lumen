package it.lumen.data.dto;

import it.lumen.data.entity.RichiestaServizio;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

/**
 * Data Transfer Object (DTO) per le richieste di servizio.
 * Contiene informazioni sul contenuto della richiesta, la data, lo stato e gli
 * utenti coinvolti.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RichiestaServizioDTO {

    /** Identificativo univoco della richiesta di servizio. */
    private Integer idRichiestaServizio;

    /** Testo descrittivo della richiesta. */
    private String testo;

    /** Data in cui è stata effettuata la richiesta. */
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date dataRichiesta;

    /** Stato corrente della richiesta (es. APERTA, CHIUSA, IN_LAVORAZIONE). */
    private RichiestaServizio.StatoRichiestaServizio stato;

    /** Email dell'utente beneficiario del servizio. */
    @Email(message = "Email del beneficiario non valida")
    private String beneficiario;

    /** Email dell'ente o volontario destinatario della richiesta. */
    @Email(message = "Email del destinatario non valida")
    private String enteVolontario;
}
