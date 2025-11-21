package it.lumen.data.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.sql.Date;

@Entity
@Table(name = "raccoltafondi")
public class RaccoltaFondi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idraccolta")
    private Integer IDRaccolta;

    @NotNull(message = "Deve essere inserito un titolo")
    @Column(name = "titolo", nullable = false, length=255)
    private String titolo;

    @Column(name = "descrizione", nullable = true)
    private String descrizione;

    @NotNull(message = "Deve essere inserito un obiettivo")
    @Positive(message = "L'obiettivo da raggiungere deve essere maggiore di zero")
    @Column(name = "totaleraccolto", nullable = false, precision = 10, scale = 2)
    private BigDecimal RaccoltaFondi;

    @Column(name = "dataapertura", nullable = false)
    private Date dataApertura;

    @Column(name = "datachiusura", nullable = false)
    private Date dataChiusura;

    @ManyToOne
    @NotNull(message = "Non è stato specificato l'Ente")
    @JoinColumn(name = "ente")
    private Utente ente;



}
