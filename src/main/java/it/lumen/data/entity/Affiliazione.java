package it.lumen.data.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@Entity
@Table(name = "Affiliazione")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/**
 * Entity che rappresenta l'affiliazione tra un volontario e un ente.
 */
public class Affiliazione {

    /**
     * Enumerazione per lo stato dell'affiliazione.
     * Accettata: l'affiliazione è attiva.
     * InAttesa: l'affiliazione è in attesa di approvazione.
     */
    public enum StatoAffiliazione {
        Accettata,
        InAttesa
    }

    /**
     * Identificativo univoco dell'affiliazione.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDAffiliazione")
    private Integer idAffiliazione;

    /**
     * Descrizione opzionale dell'affiliazione.
     */
    @Column(name = "descrizione", columnDefinition = "TEXT")
    private String descrizione;

    /**
     * Data di creazione dell'affiliazione.
     */
    @Column(name = "datainizio", nullable = false)
    @NotNull(message = "La data di inizio non può essere nulla")
    private Date dataInizio;

    /**
     * Stato attuale dell'affiliazione.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "stato", nullable = false)
    @NotNull(message = "Lo stato non può essere nullo")
    private StatoAffiliazione stato;

    /**
     * L'ente a cui il volontario si affilia.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ente", nullable = false)
    private Utente ente;

    /**
     * Il volontario che richiede l'affiliazione.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "volontario", nullable = false)
    private Utente volontario;

}