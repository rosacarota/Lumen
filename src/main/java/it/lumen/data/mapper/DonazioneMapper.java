package it.lumen.data.mapper;

import it.lumen.data.dto.DonazioneDTO;
import it.lumen.data.entity.Donazione;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;



@Mapper(componentModel = "spring",
        uses = {UtenteMapper.class, UtenteMapper.class, RaccoltaFondiMapper.class,},
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DonazioneMapper {

    DonazioneDTO toDto(Donazione entity);

    Donazione toEntity(DonazioneDTO dto);

}