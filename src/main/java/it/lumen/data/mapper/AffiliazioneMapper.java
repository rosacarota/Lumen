package it.lumen.data.mapper;

import it.lumen.data.dto.AffiliazioneDTO;

import it.lumen.data.entity.Affiliazione;

import org.mapstruct.Mapper;

import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        uses = {UtenteMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)

public interface AffiliazioneMapper {



    AffiliazioneDTO toDto(Affiliazione entity);


    Affiliazione toEntity(AffiliazioneDTO dto);
}
