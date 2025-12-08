package it.lumen.data.mapper;

import it.lumen.data.dto.EventoDTO;
import it.lumen.data.entity.Evento;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

/**
 * Mapper per la gestione delle conversioni relative alla Partecipazione.
 */
@Mapper(componentModel = "spring", uses = { UtenteMapper.class,
        EventoMapper.class }, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PartecipazioneMapper {

    /**
     * Converte un'entità (attualmente Evento) in un DTO.
     *
     * @param entity L'entità da convertire.
     * @return Il DTO risultante.
     */
    @Mapping(source = "volontario.email", target = "volontario")
    @Mapping(source = "evento.idEvento", target = "evento")
    EventoDTO toDto(Evento entity);

}
