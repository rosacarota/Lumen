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
public class RaccoltaFondi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idraccolta")
    private Integer idRaccoltaFondi;

    @NotBlank(message = "Un titolo è obbligatorio")
    @Column(name = "titolo", nullable = false, length=255)
    private String titolo;

    @Column(name = "descrizione", nullable = true)
    private String descrizione;

    @NotNull(message = "Un obiettivo è obbligatorio")
    @Positive(message = "L'obiettivo da raggiungere deve essere maggiore di zero")
    @Column(name = "obiettivo", nullable = false, precision = 10, scale = 2)
    private BigDecimal obiettivo;

    @Column(name = "totaleraccolto", nullable = false, precision = 10, scale = 2)
    private BigDecimal totaleRaccolto;

    @NotNull(message = "Una data di apertura è obbligatoria")
    @Column(name = "dataapertura", nullable = false)
    private Date dataApertura;

    @NotNull(message = "Una data di chiusura è obbligatoria")
    @Column(name = "datachiusura", nullable = false)
    private Date dataChiusura;

    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull(message = "L'ente è obbligatorio")
    @JoinColumn(name = "ente")
    private Utente ente;
}
