package it.lumen.data.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.sql.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartecipazioneDTO {

    @NotNull(message = "Un id è obbligatorio")
    private Integer idPartecipazione;

    @NotNull(message = "La data di partecipazione è obbligatoria")
    private Date data;

    @NotNull(message = "L'id dell'evento è obbligatorio")
    private Integer idEvento;

    private String nomeEvento;

    @NotBlank(message = "L'email del volontario è obbligatoria")
    @Email(message = "Formato email del volontario non valido")
    private String emailVolontario;
}