package it.lumen.data.mapper;

import it.lumen.data.dto.RaccoltaFondiDTO;
import it.lumen.data.entity.RaccoltaFondi;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        uses = {UtenteMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)

public interface RaccoltaFondiMapper {

    @Mapping(source = "ente.email", target = "ente")
    RaccoltaFondiDTO toDto(RaccoltaFondi entity);

}
