package it.lumen.data.mapper;

import it.lumen.data.dto.IndirizzoDTO;
import it.lumen.data.entity.Indirizzo;
import org.mapstruct.Mapper;

/**
 * Mapper per la conversione tra l'entità Indirizzo e il DTO IndirizzoDTO.
 */
@Mapper(componentModel = "spring")
public interface IndirizzoMapper {

    /**
     * Converte un'entità Indirizzo in un IndirizzoDTO.
     *
     * @param entity L'entità Indirizzo.
     * @return Il corrispondente IndirizzoDTO.
     */
    IndirizzoDTO toDto(Indirizzo entity);

}