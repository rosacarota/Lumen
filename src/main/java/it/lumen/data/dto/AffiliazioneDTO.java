package it.lumen.data.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import it.lumen.data.entity.Affiliazione.StatoAffiliazione;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Date;

/**
 * Data Transfer Object (DTO) che rappresenta i dati relativi ad
 * un'affiliazione.
 * Contiene informazioni quali l'identificativo, la descrizione, la data
 * d'inizio, lo stato e gli indirizzi email dell'ente e del volontario
 * coinvolti.
 */
@Data
@NoArgsConstructor
public class AffiliazioneDTO {

    /** Identificativo univoco dell'affiliazione. */
    @NotNull(message = "Un id è obbligatorio")
    private Integer idAffiliazione;

    /** Descrizione della richiesta di affiliazione. */
    private String descrizione;

    /** Data di creazione della richiesta di affiliazione. */
    @NotNull(message = "La data di creazione è obbligatoria")
    // @Future(message = "La data di inizio non può essere nel futuro")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date dataInizio;

    /** Stato attuale dell'affiliazione (es. RICHIESTA, ACCETTATA, RIFIUTATA). */
    @NotNull(message = "Lo stato dell'affiliazione è obbligatorio")
    private StatoAffiliazione stato;

    /** Email dell'ente presso cui viene richiesta l'affiliazione. */
    @NotBlank(message = "L'email dell'ente è obbligatoria")
    @Email(message = "Formato email dell'ente non valido")
    private String ente;

    /** Email del volontario che richiede l'affiliazione. */
    @NotBlank(message = "L'email del volontario è obbligatoria")
    @Email(message = "Formato email del volontario non valido")
    private String volontario;
}