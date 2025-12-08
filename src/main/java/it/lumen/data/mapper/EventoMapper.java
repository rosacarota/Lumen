package it.lumen.data.mapper;

import it.lumen.data.dto.EventoDTO;
import it.lumen.data.entity.Evento;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

/**
 * Mapper per la conversione tra l'entità Evento e il DTO EventoDTO.
 * Utilizza MapStruct.
 */
@Mapper(componentModel = "spring", uses = { UtenteMapper.class }, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EventoMapper {

    /**
     * Converte un'entità Evento in un EventoDTO.
     * Mappa l'email dell'utente creatore.
     *
     * @param entity L'entità Evento da convertire.
     * @return Il corrispondente EventoDTO.
     */
    @Mapping(source = "utente.email", target = "utente")
    EventoDTO toDto(Evento entity);

}
