package it.lumen.data.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Pattern;

@Entity
@Table(name="Utente")
@Getter
@Setter
@NoArgsConstructor
public class Utente {

    public enum Ruolo{
        Volontario,
        Beneficiario,
        Ente
    }

    @Id
    @Column(name="email", nullable=false, length=255)
    @Email(message = "Email non valida")
    private String email;

    @Column(name="nome", nullable= false, length=100)
    private String nome;

    @Column(name="cognome", nullable= false, length=100)
    private String cognome;

    @ManyToOne(fetch = FetchType.LAZY)
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

    @Column(name="immagine", nullable=true, length=255)
    private String immagine;

}
