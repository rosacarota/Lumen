package it.lumen.data.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;

@Entity
@Table(name = "Evento")
@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/**
 * Entity che rappresenta un evento organizzato da un ente o utente.
 */
public class Evento {

    /**
     * Identificativo univoco dell'evento.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDEvento")
    private Integer idEvento;

    /**
     * Titolo dell'evento.
     */
    @Column(name = "titolo", nullable = false, length = 255)
    private String titolo;

    /**
     * Descrizione dettagliata dell'evento.
     */
    @Column(name = "descrizione", nullable = true)
    private String descrizione;

    /**
     * Indirizzo dove si svolge l'evento.
     */
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "Luogo", nullable = false)
    private Indirizzo indirizzo;

    /**
     * Data di inizio dell'evento.
     */
    @Column(name = "datainizio", nullable = false)
    private Date dataInizio;

    /**
     * Data di fine dell'evento.
     */
    @Column(name = "datafine", nullable = false)
    private Date dataFine;

    /**
     * Numero massimo di partecipanti ammessi.
     */
    @Column(name = "maxpartecipanti", nullable = true)
    private int maxPartecipanti;

    /**
     * Percorso o URL dell'immagine associata all'evento.
     */
    @Column(name = "immagine", nullable = true)
    private String immagine;

    /**
     * L'utente (tipicamente Ente) che ha creato l'evento.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Ente")
    @JsonIgnoreProperties({ "cognome", "password", "ambito", "descrizione", "indirizzo", "recapitoTelefonico", "ruolo",
            "hibernateLazyInitializer" })
    private Utente utente;

}
