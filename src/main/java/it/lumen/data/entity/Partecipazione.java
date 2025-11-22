package it.lumen.data.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Entity
@Table(name = "Partecipazione", uniqueConstraints = @UniqueConstraint(columnNames = {"Evento", "Volontario"}))
@Getter
@Setter
public class Partecipazione {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDPartecipazione")
    private Integer idPartecipazione;

    @Column(name = "datapartecipazione", nullable = false)
    @NotNull(message = "La data di partecipazione non può essere nulla")
    private Date data;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento", nullable = false)
    private Evento evento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "volontario", nullable = false)
    private Utente volontario;
}