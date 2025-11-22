package it.lumen.data.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Date;

@Entity
@Table(name = "donazione")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Donazione {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "iddonazione")
    private Integer idDonazione;

    @NotNull(message = "Deve essere inserito un importo")
    @Positive(message = "L'importo deve essere positivo")
    @Column(name = "importo", nullable = false, precision = 10, scale = 2)
    private BigDecimal importo;


    @NotNull(message = "Deve essere specificata la data di apertura")
    @Column(name = "datadonazione", nullable = false)
    private Date dataDonazione;


    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull(message = "Non è stato specificato l'Utente")
    @JoinColumn(name = "utente")
    private Utente ente;

    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull(message = "Inserire Raccolta fondi")
    @JoinColumn(name= "idraccolta")
    private RaccoltaFondi raccoltaFondi;
}
