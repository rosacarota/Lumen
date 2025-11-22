package it.lumen.data.mapper;

import it.lumen.data.dto.RichiestaServizioDTO;
import it.lumen.data.entity.RichiestaServizio;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        uses = {UtenteMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)

public interface RichiestaServizioMapper {

    RichiestaServizioDTO toDto(RichiestaServizio entity);
    RichiestaServizio toEntity(RichiestaServizioDTO dto);
}
