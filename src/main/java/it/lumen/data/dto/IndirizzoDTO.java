package it.lumen.data.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IndirizzoDTO {

    private Integer idIndirizzo;

    @NotBlank(message = "La città è obbligatoria")
    @Size(max = 100, message = "La città non può superare i 100 caratteri")
    private String citta;

    @NotBlank(message = "La provincia è obbligatoria")
    @Size(max = 50, message = "La provincia non può superare i 50 caratteri")
    private String provincia;

    @NotBlank(message = "Il CAP è obbligatorio")
    @Pattern(regexp = "\\d{5}", message = "Il CAP deve essere composto da 5 cifre")
    private String cap;

    @NotBlank(message = "La strada è obbligatoria")
    @Size(max = 255, message = "La strada non può superare i 255 caratteri")
    private String strada;

    private Integer nCivico;
}