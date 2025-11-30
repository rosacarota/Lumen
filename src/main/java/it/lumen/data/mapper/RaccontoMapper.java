package it.lumen.data.mapper;

import it.lumen.data.dto.RaccontoDTO;
import it.lumen.data.entity.Racconto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;


@Mapper(
        componentModel = "spring",
        uses = {UtenteMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface RaccontoMapper {

    @Mapping(source = "utente.email", target = "emailUtente")
    RaccontoDTO toDto(Racconto entity);

}