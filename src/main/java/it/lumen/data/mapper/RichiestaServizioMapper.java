package it.lumen.data.mapper;

import it.lumen.data.dto.RichiestaServizioDTO;
import it.lumen.data.entity.RichiestaServizio;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

/**
 * Mapper per la conversione tra l'entità RichiestaServizio e il DTO
 * RichiestaServizioDTO.
 */
@Mapper(componentModel = "spring", uses = { UtenteMapper.class }, unmappedTargetPolicy = ReportingPolicy.IGNORE)

public interface RichiestaServizioMapper {

    /**
     * Converte un'entità RichiestaServizio in un RichiestaServizioDTO.
     * Mappa le email del beneficiario e dell'ente volontario.
     *
     * @param entity L'entità RichiestaServizio.
     * @return Il corrispondente RichiestaServizioDTO.
     */
    @Mapping(source = "beneficiario.email", target = "beneficiario")
    @Mapping(source = "enteVolontario.email", target = "enteVolontario")
    RichiestaServizioDTO toDto(RichiestaServizio entity);

}
