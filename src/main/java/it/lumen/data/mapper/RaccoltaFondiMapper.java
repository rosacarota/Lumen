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
    @Mapping(source = "IDRaccolta", target = "idRaccoltaFondi")
    @Mapping(source = "totaleraccolto", target = "totaleRaccolto")
    @Mapping(source = "ente", target = "ente")
    RaccoltaFondiDTO toDto(RaccoltaFondi entity);

    @Mapping(source = "idRaccoltaFondi", target = "IDRaccolta")
    @Mapping(source = "totaleRaccolto", target = "totaleraccolto")
    RaccoltaFondi toEntity(RaccoltaFondiDTO dto);
}
