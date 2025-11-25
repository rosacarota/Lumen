package it.lumen.data.mapper;

import it.lumen.data.dto.AffiliazioneDTO;
import it.lumen.data.entity.Affiliazione;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        uses = {UtenteMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)

public interface AffiliazioneMapper {

    @Mapping(source = "ente.email", target = "ente")
    @Mapping(source = "volontario.email", target="volontario")
    AffiliazioneDTO toDto(Affiliazione entity);

}
