package it.lumen.data.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@Entity
@Table(name = "Partecipazione", uniqueConstraints = @UniqueConstraint(columnNames = { "Evento", "Volontario" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/**
 * Entity che rappresenta la partecipazione di un volontario a un evento.
 */
public class Partecipazione {

    /**
     * Identificativo univoco della partecipazione.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDPartecipazione")
    private Integer idPartecipazione;

    /**
     * Data in cui è stata registrata la partecipazione.
     */
    @Column(name = "datapartecipazione", nullable = false)
    @NotNull(message = "La data di partecipazione non può essere nulla")
    private Date data;

    /**
     * L'evento a cui si partecipa.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento", nullable = false)
    private Evento evento;

    /**
     * Il volontario che partecipa.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "volontario", nullable = false)
    private Utente volontario;
}