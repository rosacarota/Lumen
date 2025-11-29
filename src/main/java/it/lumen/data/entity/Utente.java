package it.lumen.data.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import javax.validation.constraints.Pattern;
import java.io.Serializable;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Entity
@Table(name="Utente")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Utente implements Serializable {

    public enum Ruolo{
        Volontario,
        Beneficiario,
        Ente
    }

    @Id
    @Column(name="email", nullable=false, length=255)
    @Email(message = "Email non valida")
    private String email;

    @NotBlank(message = "Un nome è obbligatorio")
    @Column(name="nome", nullable= false, length=100)
    private String nome;

    @Column(name="cognome", nullable= false, length=100)
    private String cognome;

    @ManyToOne(cascade = CascadeType.ALL , fetch = FetchType.LAZY)
    @JoinColumn(name = "Indirizzo")
    private Indirizzo indirizzo;

    @Column(name="password", nullable=false, length=255)
    private String password;

    @Column(name="descrizione", nullable=false)
    private String descrizione;

    @Pattern(regexp = "\\d{10}", message = "Il numero deve essere composto da 10 cifre")
    @Column(name="recapitotelefonico", nullable=true, length=10)
    private String recapitoTelefonico;

    @Enumerated(EnumType.STRING)
    @Column(name = "ruolo", nullable = false)
    @NotNull(message = "Il ruolo non può essere nullo")
    private Utente.Ruolo ruolo;

    @Column(name="ambito", nullable=true, length=100)
    private String ambito;

    @Column(name="immagine", nullable=true)
    private String immagine;

}
