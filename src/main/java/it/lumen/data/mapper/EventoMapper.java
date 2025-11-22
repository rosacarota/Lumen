package it.lumen.data.mapper;

import it.lumen.data.dto.EventoDTO;
import it.lumen.data.entity.Evento;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",
        uses = {UtenteMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EventoMapper {

    @Mapping(source = "utente.email", target = "utente")
    EventoDTO toDto(Evento entity);

}
