package it.lumen.data.dto;

import it.lumen.data.entity.Utente;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UtenteDTO {

    @Email(message = "Email non valida")
    @NotBlank(message = "Email obbligatoria")
    private String email;

    @Size(max = 100)
    private String nome;

    @Size(max = 100)
    private String cognome;

    private Integer indirizzo;

    private String password;

    private String descrizione;

    @Pattern(regexp = "\\d{10}", message = "Il recapito telefonico deve avere 10 cifre")
    private String recapitoTelefonico;

    @Size(max = 100)
    private String ambito;

    private Utente.Ruolo ruolo;

    private String immagine;

}


