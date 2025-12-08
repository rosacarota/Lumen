package it.lumen.data.mapper;

import it.lumen.data.dto.RaccoltaFondiDTO;
import it.lumen.data.entity.RaccoltaFondi;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

/**
 * Mapper per la conversione tra l'entità RaccoltaFondi e il DTO
 * RaccoltaFondiDTO.
 */
@Mapper(componentModel = "spring", uses = { UtenteMapper.class }, unmappedTargetPolicy = ReportingPolicy.IGNORE)

public interface RaccoltaFondiMapper {

    /**
     * Converte un'entità RaccoltaFondi in un RaccoltaFondiDTO.
     * Mappa l'email dell'ente promotore.
     *
     * @param entity L'entità RaccoltaFondi.
     * @return Il corrispondente RaccoltaFondiDTO.
     */
    @Mapping(source = "ente.email", target = "ente")
    RaccoltaFondiDTO toDto(RaccoltaFondi entity);

}
