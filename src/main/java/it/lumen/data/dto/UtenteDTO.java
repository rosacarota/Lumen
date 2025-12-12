package it.lumen.data.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import it.lumen.data.entity.Indirizzo;
import it.lumen.data.entity.Utente;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) che rappresenta un utente del sistema.
 * Include dati anagrafici, di contatto, credenziali e ruolo.
 */
@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "nome", "cognome", "email", "ruolo", "immagine" })
public class UtenteDTO {

    /** Indirizzo email. */
    @Email(message = "Email non valida")
    @NotBlank(message = "Email obbligatoria")
    private String email;

    /** Nome dell'utente. */
    @Size(max = 100)
    private String nome;

    /** Cognome dell'utente. */
    @Size(max = 100)
    private String cognome;

    /** Identificativo dell'indirizzo associato. */
    private Integer indirizzo;

    /** Oggetto Indirizzo completo associato. */
    private Indirizzo objIndirizzo;

    /** Password dell'utente. */
    private String password;

    /** Descrizione o biografia dell'utente. */
    private String descrizione;

    /** Recapito telefonico. */
    @Pattern(regexp = "\\d{10}", message = "Il recapito telefonico deve avere 10 cifre")
    private String recapitoTelefonico;

    /** Ambito di competenza o interesse. */
    @Size(max = 100)
    private String ambito;

    /** Ruolo dell'utente nel sistema. */
    private Utente.Ruolo ruolo;

    /** URL o percorso dell'immagine di profilo. */
    private String immagine;

    /** Identificativo dell'affiliazione associata, se presente. */
    private int idAffiliazione;

}
