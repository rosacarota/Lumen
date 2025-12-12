package it.lumen.data.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Date;

@Entity
@Table(name = "raccoltafondi")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/**
 * Entity che rappresenta una campagna di raccolta fondi.
 */
public class RaccoltaFondi {

    /**
     * Identificativo univoco della raccolta fondi.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idraccolta")
    private Integer idRaccoltaFondi;

    /**
     * Titolo della campagna di raccolta fondi.
     */
    @NotBlank(message = "Un titolo è obbligatorio")
    @Column(name = "titolo", nullable = false, length = 255)
    private String titolo;

    /**
     * Descrizione della campagna.
     */
    @Column(name = "descrizione", nullable = true)
    private String descrizione;

    /**
     * Somma obiettivo da raggiungere con la raccolta fondi.
     */
    @NotNull(message = "Un obiettivo è obbligatorio")
    @Positive(message = "L'obiettivo da raggiungere deve essere maggiore di zero")
    @Column(name = "obiettivo", nullable = false, precision = 10, scale = 2)
    private BigDecimal obiettivo;

    /**
     * Somma attualmente raccolta.
     */
    @Column(name = "totaleraccolto", nullable = false, precision = 10, scale = 2)
    private BigDecimal totaleRaccolto;

    /**
     * Data di inizio della raccolta fondi.
     */
    @NotNull(message = "Una data di apertura è obbligatoria")
    @Column(name = "dataapertura", nullable = false)
    private Date dataApertura;

    /**
     * Data di chiusura (termine) della raccolta fondi.
     */
    @NotNull(message = "Una data di chiusura è obbligatoria")
    @Column(name = "datachiusura", nullable = false)
    private Date dataChiusura;

    /**
     * Ente che promuove la raccolta fondi.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull(message = "L'ente è obbligatorio")
    @JoinColumn(name = "ente")
    private Utente ente;
}
