package it.lumen.data.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;

import javax.validation.constraints.Pattern;

@Entity
@Table(name="Utente")

public class Utente {

    @Id
    @Column(name="email", nullable=false, length=255)
    @Email(message = "Email non valida")
    private String email;

    @Column(name="nome", nullable= false, length=100)
    private String nome;

    @Column(name="cognome", nullable= false, length=100)
    private String cognome;

    @ManyToOne
    @JoinColumn(name = "Indirizzo")
    private Indirizzo indirizzo;

    @Column(name="password", nullable=false, length=255)
    private String password;

    @Column(name="descrizione", nullable=false)
    private String descrizione;

    @Pattern(regexp = "\\d{10}", message = "Il numero deve essere composto da 10 cifre")
    @Column(name="recapitotelefonico", nullable=true, length=10)
    private String recapitoTelefonico;

    @Column(name="ambito", nullable=true, length=100)
    private String ambito;

    @Column(name="immagine", nullable=true, length=255)
    private String immagine;

    public Utente(String email, String nome, String cognome, Indirizzo indirizzo, String password, String descrizione, String recapitoTelefonico, String ambito, String immagine) {
        this.email = email;
        this.nome = nome;
        this.cognome = cognome;
        this.indirizzo = indirizzo;
        this.password = password;
        this.descrizione = descrizione;
        this.recapitoTelefonico = recapitoTelefonico;
        this.ambito = ambito;
        this.immagine = immagine;
    }

    public Utente() {

    }
}
