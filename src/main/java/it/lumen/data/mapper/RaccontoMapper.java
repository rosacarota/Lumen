package it.lumen.data.mapper;

import it.lumen.data.dto.RaccontoDTO;
import it.lumen.data.entity.Racconto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

/**
 * Mapper per la conversione tra l'entità Racconto e il DTO RaccontoDTO.
 */
@Mapper(componentModel = "spring", uses = { UtenteMapper.class }, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RaccontoMapper {

    /**
     * Converte un'entità Racconto in un RaccontoDTO.
     * Mappa l'email dell'utente autore.
     *
     * @param entity L'entità Racconto.
     * @return Il corrispondente RaccontoDTO.
     */
    @Mapping(source = "utente.email", target = "emailUtente")
    RaccontoDTO toDto(Racconto entity);

}