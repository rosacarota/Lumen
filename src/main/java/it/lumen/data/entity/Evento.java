package it.lumen.data.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@Entity
@Table(name="Evento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="IDEvento")
    private Integer idEvento;

    @Column(name="titolo", nullable= false, length=255)
    private String titolo;

    @Column(name="descrizione", nullable= true)
    private String descrizione;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "Luogo", nullable = false)
    private Indirizzo indirizzo;

    @Column(name="datainizio", nullable= false)
    private Date dataInizio;

    @Column(name="datafine", nullable= false)
    private Date dataFine;

    @Column(name="maxpartecipanti", nullable= true)
    private int maxPartecipanti;

    @Column(name="immagine", nullable= true, length=255)
    private String immagine;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Ente")
    @JsonIgnoreProperties({"cognome", "password", "ambito", "descrizione", "indirizzo", "recapitoTelefonico", "immagine", "ruolo", "hibernateLazyInitializer"})
    private Utente utente;

}
