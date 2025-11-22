package it.lumen.data.mapper;

import it.lumen.data.dto.DonazioneDTO;
import it.lumen.data.entity.Donazione;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;



@Mapper(componentModel = "spring",
        uses = {UtenteMapper.class,RaccoltaFondiMapper.class,},
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DonazioneMapper {

    @Mapping(source="ente.email", target="ente")
    @Mapping(source = "raccoltaFondi.idRaccoltaFondi", target = "idRaccoltaFondi")
    DonazioneDTO toDto(Donazione entity);

}