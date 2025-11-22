package it.lumen.data.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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

    @NotNull(message = "Deve essere inserito un titolo")
    @Column(name = "titolo", nullable = false, length=255)
    private String titolo;

    @Column(name = "descrizione", nullable = true)
    private String descrizione;

    @NotNull(message = "Deve essere inserito un obiettivo")
    @Positive(message = "L'obiettivo da raggiungere deve essere maggiore di zero")
    @Column(name = "obiettivo", nullable = false, precision = 10, scale = 2)
    private BigDecimal obiettivo;

    @Column(name = "totaleraccolto", nullable = false, precision = 10, scale = 2)
    private BigDecimal totaleRaccolto;

    @NotNull(message = "Deve essere specificata la data di apertura")
    @Column(name = "dataapertura", nullable = false)
    private Date dataApertura;

    @NotNull(message = "Deve essere specificata la data di chiusura")
    @Column(name = "datachiusura", nullable = false)
    private Date dataChiusura;

    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull(message = "Non è stato specificato l'Ente")
    @JoinColumn(name = "ente")
    private Utente ente;
}
