package it.lumen.data.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Data Transfer Object (DTO) che rappresenta un indirizzo fisico.
 * Contiene informazioni come città, provincia, CAP, via e numero civico.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IndirizzoDTO {

    /** Identificativo univoco dell'indirizzo. */
    private Integer idIndirizzo;

    /** Città dell'indirizzo. */
    @NotBlank(message = "La città è obbligatoria")
    @Size(max = 100, message = "La città non può superare i 100 caratteri")
    private String citta;

    /** Provincia dell'indirizzo. */
    @NotBlank(message = "La provincia è obbligatoria")
    @Size(max = 50, message = "La provincia non può superare i 50 caratteri")
    private String provincia;

    /**
     * Codice di Avviamento Postale (CAP).
     * Deve essere di 5 cifre
     */
    @NotBlank(message = "Il CAP è obbligatorio")
    @Pattern(regexp = "\\d{5}", message = "Il CAP deve essere composto da 5 cifre")
    private String cap;

    /** Nome della via, piazza o strada. */
    @NotBlank(message = "La strada è obbligatoria")
    @Size(max = 255, message = "La strada non può superare i 255 caratteri")
    private String strada;

    /** Numero civico. */
    private Integer nCivico;
}