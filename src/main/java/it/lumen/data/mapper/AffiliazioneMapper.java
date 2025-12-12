package it.lumen.data.mapper;

import it.lumen.data.dto.AffiliazioneDTO;
import it.lumen.data.entity.Affiliazione;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

/**
 * Mapper per la conversione tra l'entità Affiliazione e il DTO AffiliazioneDTO.
 * Utilizza MapStruct per la generazione automatica del codice di mapping.
 */
@Mapper(componentModel = "spring", uses = { UtenteMapper.class }, unmappedTargetPolicy = ReportingPolicy.IGNORE)

public interface AffiliazioneMapper {

    /**
     * Converte un'entità Affiliazione in un oggetto AffiliazioneDTO.
     * Mappa l'email dell'ente e del volontario.
     *
     * @param entity L'entità Affiliazione da convertire.
     * @return Il corrispondente AffiliazioneDTO.
     */
    @Mapping(source = "ente.email", target = "ente")
    @Mapping(source = "volontario.email", target = "volontario")
    AffiliazioneDTO toDto(Affiliazione entity);

}
