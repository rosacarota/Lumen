package it.lumen.data.mapper;

import it.lumen.data.dto.RaccontoDTO;
import it.lumen.data.entity.Racconto;
import it.lumen.data.mapper.UtenteMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(
        componentModel = "spring",
        uses = {UtenteMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface RaccontoMapper {

    @Mapping(target = "utente", source = "utente")
    RaccontoDTO toDto(Racconto entity);

    @Mapping(target = "utente", source = "utente")
    Racconto toEntity(RaccontoDTO dto);

    List<RaccontoDTO> toDtoList(List<Racconto> entities);
    List<Racconto> toEntityList(List<RaccontoDTO> dtos);
}