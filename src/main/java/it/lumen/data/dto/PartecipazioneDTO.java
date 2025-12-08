package it.lumen.data.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.sql.Date;

/**
 * Data Transfer Object (DTO) che rappresenta la partecipazione di un volontario
 * ad un evento.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartecipazioneDTO {

    /** Identificativo univoco della partecipazione. */
    @NotNull(message = "Un id è obbligatorio")
    private Integer idPartecipazione;

    /** Data in cui avviene o è avvenuta la partecipazione. */
    @NotNull(message = "La data di partecipazione è obbligatoria")
    private Date data;

    /** Identificativo dell'evento a cui si partecipa. */
    @NotNull(message = "L'id dell'evento è obbligatorio")
    private Integer idEvento;

    /** Nome dell'evento a cui si partecipa. */
    private String nomeEvento;

    /** Email del volontario partecipante. */
    @NotBlank(message = "L'email del volontario è obbligatoria")
    @Email(message = "Formato email del volontario non valido")
    private String emailVolontario;
}