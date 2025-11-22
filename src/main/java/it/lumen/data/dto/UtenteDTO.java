package it.lumen.data.dto;

import it.lumen.data.entity.Utente;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UtenteDTO {

    @Email(message = "Email non valida")
    @NotBlank(message = "Email obbligatoria")
    private String email;

    @NotBlank(message = "Nome obbligatorio")
    @Size(max = 100)
    private String nome;

    @NotBlank(message = "Cognome obbligatorio")
    @Size(max = 100)
    private String cognome;

    private Integer indirizzo;

    @NotBlank(message = "Password obbligatoria")
    private String password;

    private String descrizione;

    @Pattern(regexp = "\\d{10}", message = "Il recapito telefonico deve avere 10 cifre")
    private String recapitoTelefonico;

    @Size(max = 100)
    private String ambito;

    @NotBlank(message = "Ruolo obbligatorio")
    private Utente.Ruolo ruolo;

    @Size(max = 255)
    private String immagine;

}


