package it.lumen.data.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;


@Entity
@Table(name="richiestaservizio")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RichiestaServizio {

    public enum StatoRichiestaServizio {
        Accettata,
        InAttesa
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idrichiestaservizio")
    private Integer idRichiestaServizio;

    @NotNull(message = "Specificare la richiesta")
    @Column(name = "testo", nullable = false)
    private String testo;

    @NotNull(message = "Deve essere specificata la data di creazione della richiesta")
    @Column(name = "data")
    private Date dataRichiesta;

    @NotNull(message = "Specificare lo stato della richiesta di servizio")
    @Column(name = "stato")
    StatoRichiestaServizio stato;

    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull(message = "Specificare il mittente della richiesta")
    @JoinColumn(name = "beneficiario")
    Utente beneficiario;

    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull(message = "Specificare il destinatario della richiesta")
    @JoinColumn(name = "entevolontario")
    Utente enteVolontraio;


}
