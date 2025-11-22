package it.lumen.data.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Entity
@Table(name = "Affiliazione")
@Getter
@Setter
public class Affiliazione {

    public enum StatoAffiliazione {
        Accettata,
        InAttesa
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDAffiliazione")
    private Integer idAffiliazione;

    @Column(name = "descrizione", columnDefinition = "TEXT")
    private String descrizione;

    @Column(name = "datainizio", nullable = false)
    @NotNull(message = "La data di inizio non può essere nulla")
    private Date dataInizio;

    @Enumerated(EnumType.STRING)
    @Column(name = "stato", nullable = false)
    @NotNull(message = "Lo stato non può essere nullo")
    private StatoAffiliazione stato;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ente", nullable = false)
    private Utente ente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "volontario", nullable = false)
    private Utente volontario;

}