package it.lumen.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Entity
@Table(name="Evento")
@Getter
@Setter
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="IDEvento")
    private Integer IDEvento;

    @Column(name="titolo", nullable= false, length=255)
    private String titolo;

    @Column(name="descrizione", nullable= true)
    private String descrizione;

    @ManyToOne
    @JoinColumn(name = "Luogo")
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
    private Utente utente;

}
