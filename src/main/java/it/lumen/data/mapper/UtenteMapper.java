package it.lumen.data.mapper;

import it.lumen.data.dto.UtenteDTO;
import it.lumen.data.entity.Utente;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

/**
 * Mapper per la conversione tra l'entità Utente e il DTO UtenteDTO.
 */
@Mapper(componentModel = "spring", uses = { IndirizzoMapper.class }, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UtenteMapper {

    /**
     * Converte un'entità Utente in un UtenteDTO.
     * Mappa l'ID dell'indirizzo.
     *
     * @param entity L'entità Utente.
     * @return Il corrispondente UtenteDTO.
     */
    @Mapping(source = "indirizzo.idIndirizzo", target = "indirizzo")
    UtenteDTO toDto(Utente entity);

}