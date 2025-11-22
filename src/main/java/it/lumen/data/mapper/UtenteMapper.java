package it.lumen.data.mapper;

import it.lumen.data.dto.UtenteDTO;
import it.lumen.data.entity.Utente;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import it.lumen.data.mapper.IndirizzoMapper;

@Mapper(
        componentModel = "spring",
        uses = {IndirizzoMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface UtenteMapper {

    @Mapping(target = "indirizzo", source = "indirizzo")
    UtenteDTO toDto(Utente entity);

    @Mapping(target = "indirizzo", source = "indirizzo")
    Utente toEntity(UtenteDTO dto);

}